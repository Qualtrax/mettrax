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
          ? moment(element.node.tag.commit.committedDate)
          : "",
      isMajor:
        element.node.tag != undefined ? isMajorTag(element.node.tag.name) : ""
    };
  });

  const todaysDate = new Date();
  const majorTagsWithinTheLastYear = allTags.filter(tag => {
    return tag.commitDate.diff(todaysDate, "years") >= 0;
  });
  const tags = majorTagsWithinTheLastYear.sort(
    (a, b) => a.commitDate < b.commitDate
  );

  return tags;
};

const getMilestonesSince = async function(sinceDate) {
  const milestonesResponse = await gitHubRepository.getMilestonesSince(sinceDate);
  console.log(milestonesResponse);
  const qualtraxEdges = milestonesResponse.data.qualtraxRepo.milestones.edges;
  const qualtraxWebEdges = milestonesResponse.data.qualtraxWebRepo.milestones.edges;
  const combinedRepos = qualtraxEdges.concat(qualtraxWebEdges);
  const today = moment(new Date());
  const withinLastYear = combinedRepos.filter(milestone => {
    return today.diff(milestone.node.dueOn, "years") <= 0;
  });

  return withinLastYear.sort((a, b) => a.node.dueOn < b.node.dueOn);
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
    allCommits.push(...commitsResponse.data.repository.defaultBranchRef.target.history.commits);

    cursor = commitsResponse.data.repository.defaultBranchRef.target.history.pageInfo.endCursor;
    hasNextPage = commitsResponse.data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage;
  }

  const commitsWithIssueNumbers = allCommits.filter(
    element => element.commit.messageHeadline.startsWith("[")
  );

  return commitsWithIssueNumbers.map(element => {
    return {
      committedDate: element.commit.committedDate,
      messageHeadline: element.commit.messageHeadline,
      repository: parseRepositoryFromHeadline(
        element.commit.messageHeadline
      ),
      issueNumber: parseIssueNumberFromMessage(
        element.commit.messageHeadline
      )
    };
  });
}

export default {
  getTagsSince,
  getMilestonesSince,
  getCommitsSince
};
