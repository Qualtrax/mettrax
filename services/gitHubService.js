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

  // get all major version tag commits and then loop through them figuring out what commits belong with what tag
  // get all minor version tag commits
  // find the difference between the minor version to it's major
  // remove those commits from the major commits
  // find the earliest tag that the commit belongs to and what other minor versions also have that commit (they are rollups)

  const tagsWithCommits = [];
  tags.forEach(tag => tagsWithCommits.push({ ... tag, issues: [] }));

  commits.forEach(commit => {
    const tagForCommit = getTagForCommit(commit, tags);

    for (let i = 0; i < tagsWithCommits.length; i++) {
      if (tagsWithCommits[i].name == tagForCommit.name) {
        tagsWithCommits[i].issues.push(commit);
        break;
      }
    }
  });

  console.log(tagsWithCommits);
  return tagsWithCommits;
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
  getTagForCommit
};
