import queries from "../queries/gitHubQueries";

const owner = "Qualtrax";
const qualtraxRepo = "Qualtrax";
const qualtraxWebRepo = "qualtrax-web";
const apiToken = "xx";

const getTagsSince = async function(sinceDate) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`
    },
    body: JSON.stringify({
      query: queries.getTagsQuery,
      variables: { owner, name: qualtraxRepo }
    })
  }).then(r => r.json());
};

const getMilestonesSince = async function(sinceDate) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`
    },
    body: JSON.stringify({
      query: queries.getMilestonesQuery,
      variables: { owner, qualtraxRepo, qualtraxWebRepo }
    })
  }).then(r => r.json());
};

const getCommitsSince = async function(sinceDate, cursor) {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`
    },
    body: JSON.stringify({
      query: queries.getCommitsQuery,
      variables: {
        owner,
        name: qualtraxRepo,
        date: sinceDate,
        after: cursor
      }
    })
  }).then(r => r.json());
};

export default {
  getTagsSince,
  getMilestonesSince,
  getCommitsSince
};
