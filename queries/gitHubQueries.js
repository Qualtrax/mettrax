const getTagsQuery = `query GetTags($owner: String!, $name: String!){
  repository(owner: $owner, name: $name) {
    refs(last: 100, refPrefix: "refs/tags/") {
      tags: edges {
        node {
          tag: target {
            ... on Tag {
              id
              name
              commit: target {
                ... on Commit {
                  id
                  committedDate
                }
              }
            }
          }
        }
      }
    }
  }
}`;
const getMilestonesQuery = `query GetMilestones($owner: String!, $qualtraxRepo: String!, $qualtraxWebRepo: String!){
  qualtraxRepo :repository(owner: $owner, name: $qualtraxRepo) {
    milestones(first: 100, states: CLOSED, orderBy: { field: DUE_DATE, direction: DESC }) {
      edges {
        node {
          title
          dueOn
          issues (first: 100) {
            edges {
              node {
                number
                title
              }
            }
          }
        }
      }
    }
  },
  qualtraxWebRepo :repository(owner: $owner, name: $qualtraxWebRepo) {
    milestones(first: 100, states: CLOSED, orderBy: { field: DUE_DATE, direction: DESC }) {
    edges {
      node {
        title
        dueOn
        issues (first: 100) {
          edges {
            node {
              number
              title
            }
          }
        }
      }
    }
  }
  }
}`;

const getCommitsQuery = `query GetCommits($owner: String!, $name: String!, $date: GitTimestamp!, $after: String){
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(since: $date, after: $after) {
            totalCount
            commits: edges {
              commit: node {
                ... on Commit {
                  committedDate
                  messageHeadline
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }
  }
}`;

export default {
  getTagsQuery,
  getMilestonesQuery,
  getCommitsQuery
};
