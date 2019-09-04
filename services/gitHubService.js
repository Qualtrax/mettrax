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
  const qualtraxEdges = milestonesResponse.data.qualtraxRepo.milestones.edges;
  const qualtraxWebEdges = milestonesResponse.data.qualtraxWebRepo.milestones.edges;
  const combinedRepos = qualtraxEdges.concat(qualtraxWebEdges);
  const today = moment(new Date());
  const withinLastYear = combinedRepos.filter(milestone => {
    return today.diff(milestone.node.dueOn, "years") <= 0;
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

const getCommitsSince = async function(sinceDate) {
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
    return {
      committedDate: commit.committedDate,
      messageHeadline: commit.messageHeadline,
      repository: parseRepositoryFromHeadline(
        commit.messageHeadline
      ),
      issueNumber: parseIssueNumberFromMessage(
        commit.messageHeadline
      )
    };
  });
}

const combineTagsWithCommits = function (tags, commits) {
  const tagsWithCommits = [];
  let currentTag = tags[0];

  commits.forEach(commit => {
    let tagWithIssues = { issues: [] };
    const tagForCommit = tags.find(tag => tag.commitDate == commit.committedDate);
    
    if (tagForCommit != undefined) {
      if (tagWithIssues != {})
        tagsWithCommits.push(tagWithIssues);

      currentTag = tagForCommit;
      tagWithIssues = {
        name: currentTag.name,
        dateTagged: currentTag.commitDate,
        issues: []
      };
      // tagsWithCommits[currentTag.name].name = currentTag.name;
      // tagsWithCommits[currentTag.name].dateTagged = currentTag.commitDate;
      // tagsWithCommits[currentTag.name].issues = [];
    }

    tagWithIssues.issues.push(commit);
  });

  // for (let i = 0; i < tags.length; i++) {
  //   const tag = tags[i];
  //   const lastTagDate = i == tags.length - 1 ? new Date() : tags[i + 1].commitDate;

  //   const commitsInTag = commits.filter(commit => {
  //     return commit.committedDate <= tag.commitDate && commit.committedDate > lastTagDate;
  //   });

  //   tagsWithCommits.push({
  //     name: tag.name,
  //     dateTagged: tag.commitDate,
  //     commits: commitsInTag
  //   });
  // }
  return tagsWithCommits;
}

export default {
  getTagsSince,
  getMilestonesSince,
  getCommitsSince,
  combineTagsWithCommits
};
