import gitHubRepository from "../repositories/gitHubRepository";
import moment from "moment";

const isMajorTag = function(tagName) {
  const tagParts = tagName.split(".");

  return tagParts[2] == "0" && tagParts[3] == "0";
};

const getTagsSince = async function(sinceDate) {
  const tagsResponse = await gitHubRepository.getTagsSince(null);

  const responseTags = tagsResponse.data.repository.refs.tags.filter(
    element => element.node.tag.name != undefined
  );
  const allTags = responseTags.map(element => {
    return {
      id: element.node.tag.id,
      name: element.node.tag.name,
      commitDate:
        element.node.tag.commit != undefined
          ? element.node.tag.commit.committedDate
          : "",
      isMajor:
        element.node.tag != undefined ? isMajorTag(element.node.tag.name) : ""
    };
  });

  const todaysDate = new Date();
  const majorTagsWithinTheLastYear = allTags.filter(tag => {
    return moment(tag.commitDate).diff(todaysDate, "years") >= 0;
  });

  const tags = majorTagsWithinTheLastYear.sort((a, b) => {
    if (a.commitDate > b.commitDate) return -1;
    if (a.commitDate < b.commitDate) return 1;

    return 0;
  });

  return tags;
};

const getMilestonesSince = async function(sinceDate) {
  const milestonesResponse = await gitHubRepository.getMilestonesSince(sinceDate);
  const qualtraxEdges = milestonesResponse.data.qualtraxRepo.milestones.edges.map(edge => {
    return {
      ...edge,
      repo: 'qualtrax'
    }
  });
  const qualtraxWebEdges = milestonesResponse.data.qualtraxWebRepo.milestones.edges.map(edge => {
    return {
      ...edge,
      repo: 'qualtrax-web'
    }
  });
  const combinedRepos = qualtraxEdges.concat(qualtraxWebEdges);
  const twoWeeksAgo = moment(new Date()).subtract(2, "weeks")
  const withinLastYear = combinedRepos.filter(milestone => {
    return twoWeeksAgo.diff(milestone.node.dueOn, "years") <= 0;
  });

  return withinLastYear.sort((a, b) => {
    if (a.node.dueOn > b.node.dueOn) return -1;
    if (a.node.dueOn < b.node.dueOn) return 1;

    return 0;
  });
};

const parseRepositoryFromHeadline = function(messageHeadline) {
  return messageHeadline.startsWith("[ghweb") ? "qualtrax-web" : "qualtrax";
};

const parseIssueNumberFromMessage = function(messageHeadline) {
  const issueNumberRegEx = /\[(.*?)\]/;
  const issueHeading = messageHeadline.match(issueNumberRegEx)[1];
  const isWeb = issueHeading.startsWith("ghweb");

  if (isWeb) return issueHeading.replace("ghweb", "");
  else return issueHeading.replace("gh", "").replace("GH", "");
};

const getStartDateOfMilestone = function (milestone) {
  if (milestone == undefined)
    return undefined;

  if (milestone.repo == 'qualtrax-web' && milestone.node.title.split(' ')[1] < 42)
    return moment(milestone.node.dueOn).subtract(1, "weeks");
  
  return moment(milestone.node.dueOn).subtract(2, "weeks");
}

const getCommitsSince = async function(sinceDate, milestones) {
  let allCommits = [];
  let hasNextPage = true;
  let cursor = null;

  while(hasNextPage) {
    let commitsResponse = await gitHubRepository.getCommitsSince(sinceDate, cursor);
    allCommits.push(...commitsResponse.data.repository.master.history.commits);

    cursor = commitsResponse.data.repository.master.history.pageInfo.endCursor;
    hasNextPage = commitsResponse.data.repository.master.history.pageInfo.hasNextPage;
  }

  const commitsWithIssueNumbers = allCommits.filter(
    commit => commit.messageHeadline.startsWith("[")
  );

  return commitsWithIssueNumbers.map(commit => {
    const issueNumber = parseIssueNumberFromMessage(commit.messageHeadline);
    const milestoneForCommit = milestones.find(milestone => milestone.node.issues.edges.find(issue => issue.node.number == issueNumber) != undefined);
    
    if(milestoneForCommit == undefined)
      console.log(`not here boss: ${commit.messageHeadline}`);
    else
      console.log(milestoneForCommit.node.title);

    return {
      committedDate: commit.committedDate,
      hash: commit.oid,
      messageHeadline: commit.messageHeadline,
      repository: parseRepositoryFromHeadline(
        commit.messageHeadline
      ),
      issueNumber,
      startDate: getStartDateOfMilestone(milestoneForCommit)
    };
  });
}

const combineTagsWithCommits = async function(tags, commits, milestones) {

  // [x] get all major version tag commits and then loop through them figuring out what commits belong with what tag
  // [x] get all minor version tag commits
  // [x] find the difference between the minor version to it's major
  // [x] find the earliest tag that the commit belongs to and what other minor versions also have that commit (they are rollups)
  // [x] remove those commits from the major commits

  let majorTagsWithCommits = [];
  const majorTags = tags.filter(tag => tag.isMajor);
  for (let i = 0; i < majorTags.length; i++) {
    majorTagsWithCommits.push({
      ... majorTags[i],
      issues: getCommitsForMajorRelease(majorTags[i], majorTags[i+1], commits)
    });
  }

  const minorTags = tags.filter(tag => !tag.isMajor);
  let minorTagsWithCommits = [];
  
  for (let i = 0; i < minorTags.length; i++) {
    const commitsResponse = await gitHubRepository.getCommitsForTag(minorTags[i].name);
    const commitsForTag = commitsResponse.data.repository.tagBranch.history.commits;
    const commitsWithIssueNumbers = commitsForTag.filter(
      commit => commit.messageHeadline.startsWith("[")
    );
    const commits = commitsWithIssueNumbers.map(commit => {
      const issueNumber = parseIssueNumberFromMessage(commit.messageHeadline);
      const milestoneForCommit = milestones.find(milestone => milestone.node.issues.edges.find(issue => issue.node.number == issueNumber) != undefined);
      
      return {
        committedDate: commit.committedDate,
        hash: commit.oid,
        messageHeadline: commit.messageHeadline,
        repository: parseRepositoryFromHeadline(
          commit.messageHeadline
        ),
        issueNumber,
        startDate: getStartDateOfMilestone(milestoneForCommit)
      };
    });

    minorTagsWithCommits.push({
      ...minorTags[i],
      issues: commits
    });
  }

  minorTagsWithCommits = minorTagsWithCommits.sort((a, b) => {
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;

    return 0;
  });

  const theMinors = [];

  for (let i = 0; i < minorTagsWithCommits.length; i++) {
    const previousTag = getPreviousTagNumber(minorTagsWithCommits[i].name);
    const previousTagCommits = await getCommitsFor(previousTag, minorTagsWithCommits, majorTagsWithCommits);
    const minorTagHashes = minorTagsWithCommits[i].issues.map(commit => commit.hash);
    const previousTagHashes = previousTagCommits.map(commit => commit.hash);
    const hashesJustOnMinor = minorTagHashes.filter(hash => previousTagHashes.indexOf(hash) < 0);
    const commitsJustOnMinor = minorTagsWithCommits[i].issues.filter(commit => hashesJustOnMinor.indexOf(commit.hash) >= 0);
    theMinors.push({
      id: minorTagsWithCommits[i].id,
      name: minorTagsWithCommits[i].name,
      commitDate: minorTagsWithCommits[i].commitDate,
      isMajor: minorTagsWithCommits[i].isMajor,
      issues: commitsJustOnMinor
    });
  }

  let minorCommits = [];
  theMinors.forEach(minor => minorCommits.push(...minor.issues));
  let minorCommitHashes = minorCommits.map(minorCommit => minorCommit.hash);
  minorCommitHashes = [...new Set(minorCommitHashes)];
  minorCommits = minorCommitHashes.map(commitHash => minorCommits.find(commit => commit.hash == commitHash));
  const minorCommitsWithTags = [];
  minorCommits.forEach(commit => {
    const tags = theMinors.filter(minor => minor.issues.find(issueCommit => issueCommit.hash == commit.hash) != undefined);
    minorCommitsWithTags.push({
      commit,
      tags: tags.map(tag => tag.name)
    })
  });

  const minorReleases = minorCommitsWithTags.map(minorCommit => {
    const hotfix = getLowestTag(minorCommit.tags);
    const rollups = minorCommit.tags.filter(tag => tag != hotfix);

    return {
      commit: minorCommit.commit,
      hotfix,
      rollups 
    };
  });

  const hotfixes = [];
  minorReleases.forEach(minorRelease => {
    let hotfix = hotfixes.find(hotfix => hotfix.version == minorRelease.hotfix);
    
    if (hotfix == undefined) {
      hotfix = { 
        version: minorRelease.hotfix,
        commits: [],
        rollups: minorRelease.rollups
      };
      hotfixes.push(hotfix);
    }

    console.log(`hotfix commit being added: ${minorRelease.commit.messageHeadline} - ${minorRelease.commit.startDate}`);
    hotfix.commits.push(minorRelease.commit);
  });

  majorTagsWithCommits = majorTagsWithCommits.map(majorTagWithCommits => {
    return {
      name: majorTagWithCommits.name,
      commitDate: majorTagWithCommits.commitDate,
      issues: majorTagWithCommits.issues.filter(issue => minorCommitHashes.indexOf(issue.hash) < 0)
    }
  });

  return { commitsPerTag: majorTagsWithCommits, hotfixes };
}

const getPreviousTagNumber = function(tagName) {
  const tagParts = tagName.split('.');
  tagParts[3]--;

  return tagParts.join('.');
};

const getLowestTag = function(tagNames) {
  if (tagNames.length == 1)
    return tagNames[0];

  const sortedTags = tagNames.sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;

    return 0;
  });

  return sortedTags[0];
}

const getCommitsFor = async function(tagName, minorTags, majorTags) {
  let tagWithCommits = minorTags.find(tag => tag.name == tagName);

  if (tagWithCommits == undefined)
    tagWithCommits = majorTags.find(tag => tag.name == tagName);

  if (tagWithCommits == undefined) {
    const commitsResponse = await gitHubRepository.getCommitsForTag(tagName);
    const commitsForTag = commitsResponse.data.repository.tagBranch.history.commits;
    const commitsWithIssueNumbers = commitsForTag.filter(
      commit => commit.messageHeadline.startsWith("[")
    );
    const commits = commitsWithIssueNumbers.map(commit => {
      return {
        committedDate: commit.committedDate,
        hash: commit.oid,
        messageHeadline: commit.messageHeadline,
        repository: parseRepositoryFromHeadline(
          commit.messageHeadline
        ),
        issueNumber: parseIssueNumberFromMessage(
          commit.messageHeadline
        )
      };
    });

    tagWithCommits = {
      issues: commits
    };
  }

  return tagWithCommits.issues;
}

const getCommitsForMajorRelease = function(tag, nextMajorTag, commits) {
  if (nextMajorTag == undefined)
    return commits.filter(commit => commit.committedDate <= tag.commitDate);

  return commits.filter(commit => commit.committedDate <= tag.commitDate && commit.committedDate > nextMajorTag.commitDate);
}

const getTagForCommit = function(commit, tags) {
  for(let i = 0; i < tags.length; i++) {
    const commitDateIsLessThanTagDate = commit.committedDate <= tags[i].commitDate;
    const commitDateIsGreaterThanTheNextTagsDate = i == tags.length - 1 || (i != tags.length - 1 && commit.committedDate > tags[i + 1].commitDate);
    
    if (commitDateIsLessThanTagDate && commitDateIsGreaterThanTheNextTagsDate)
      return tags[i]; 
  }

  return null;
}

export default {
  getTagsSince,
  getMilestonesSince,
  getCommitsSince,
  combineTagsWithCommits,
  getTagForCommit,
  getCommitsForMajorRelease,
  getPreviousTagNumber
};
