<template>
  <div class="container">
    <div>
      <h1>Major Releases Within The Last Year</h1>
      <ul>
        <li v-for="(tag, index) in tags" :key="index">
          <b>{{ tag.name }}</b>
          - {{ formatDate(tag.commitDate) }}
        </li>
      </ul>
    </div>
    <div>
      <h1>Milestones Within The Last Year</h1>
      <ul>
        <li v-for="(milestone, index) in milestones" :key="index">
          <p>
            <b>{{ milestone.node.title }}</b>
          </p>
          <p>Duedate: {{ formatDate(milestone.node.dueOn) }}</p>
          <p>Started: {{ formatDate(twoWeeksAgo(milestone.node.dueOn)) }}</p>
          <p>Issues:</p>
          <ul>
            <li
              v-for="(issue, issueIndex) in milestone.node.issues.edges"
              :key="issueIndex"
            >{{ issue.node.number }}</li>
          </ul>
        </li>
      </ul>
    </div>
    <div>
      <h1>Commits Within The Last Year</h1>
      <ul>
        <li v-for="(commit, index) in commits" :key="index">
          <b>{{ commit.issueNumber }}-{{ commit.repository }}</b>
          {{ commit.messageHeadline }} - {{ formatDate(commit.committedDate) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import tags from "~/apollo/queries/tags";
import repository from "~/apollo/queries/repositoryQuery";
import issuesByDates from "~/apollo/queries/issues";
import moment from "moment";
import axios from "axios";
import { all } from "q";

export default {
  data: function() {
    return {
      tags: "",
      commits: "",
      milestones: ""
    };
  },
  asyncData({ req, params }) {
    const owner = "Qualtrax";
    const qualtraxRepo = "Qualtrax";
    const qualtraxWebRepo = "qualtrax-web";

    const getReleases = `query GetReleases($owner: String!, $name: String!){
		  repository(owner: $owner, name: $name) {
		    refs(last: 30, refPrefix: "refs/tags/") {
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
    const getCommits = `query GetCommits($owner: String!, $name: String!, $date: GitTimestamp!){
		  repository(owner: $owner, name: $name) {
		    defaultBranchRef {
		      target {
		        ... on Commit {
		          history(since: $date) {
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
    const getMilestones = `query GetMilestones($owner: String!, $qualtraxRepo: String!, $qualtraxWebRepo: String!){
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
								}
							}
						}
					}
				}
			}
		  }
		}`;

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

    const today = moment(new Date());
    const isMajorTag = function(tagName) {
      const tagParts = tagName.split(".");

      return tagParts[2] == "0" && tagParts[3] == "0";
    };

    const getTags = fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer xx`
      },
      body: JSON.stringify({
        query: getReleases,
        variables: { owner, name: qualtraxRepo }
      })
    })
      .then(r => r.json())
      .then(response => {
        const responseTags = response.data.repository.refs.tags.filter(
          element => element.node.tag.name != undefined
        );
        const tags = responseTags.map(element => {
          return {
            id: element.node.tag.id,
            name: element.node.tag.name,
            commitDate:
              element.node.tag.commit != undefined
                ? moment(element.node.tag.commit.committedDate)
                : "",
            isMajor:
              element.node.tag != undefined
                ? isMajorTag(element.node.tag.name)
                : ""
          };
        });

        const majorTagsWithinTheLastYear = tags.filter(
          tag => today.diff(tag.commitDate, "years") <= 0
          //   tag => tag.isMajor && today.diff(tag.commitDate, "years") <= 0
        );

        const sortedTags = majorTagsWithinTheLastYear.sort(
          (a, b) => a.commitDate < b.commitDate
        );

        return { tags: sortedTags };
      });

    const oneYearAgo = today.subtract(1, "years");
    const getCommitsWithinLastYear = fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer xx`
      },
      body: JSON.stringify({
        query: getCommits,
        variables: { owner, name: qualtraxRepo, date: oneYearAgo }
      })
    })
      .then(r => r.json())
      .then(data => {
        const commitsWithIssueNumbers = data.data.repository.defaultBranchRef.target.history.commits.filter(
          element => element.commit.messageHeadline.startsWith("[")
        );
        const commits = commitsWithIssueNumbers.map(element => {
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

        return {
          commits
        };
      });

    const getMilestonesWithinLastYear = fetch(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer xx`
        },
        body: JSON.stringify({
          query: getMilestones,
          variables: { owner, qualtraxRepo, qualtraxWebRepo }
        })
      }
    )
      .then(r => r.json())
      .then(response => {
		const qualtraxEdges = response.data.qualtraxRepo.milestones.edges;
		const qualtraxWebEdges = response.data.qualtraxWebRepo.milestones.edges;
		const combinedRepos = qualtraxEdges.concat(qualtraxWebEdges);
        const withinLastYear = combinedRepos.filter(milestone => {
          return today.diff(milestone.node.dueOn, "years") <= 0;
        });
		const milestones = withinLastYear.sort((a, b) => a.node.dueOn < b.node.dueOn);
		
        return {
          milestones
        };
      });

    return Promise.all([
      getTags,
      getCommitsWithinLastYear,
      getMilestonesWithinLastYear
    ]).then(values => {
      return {
        tags: values[0].tags,
        commits: values[1].commits,
        milestones: values[2].milestones
      };
    });
  },
  methods: {
    formatDate: function(date) {
      return moment(date).format("MMM Do YYYY");
    },
    twoWeeksAgo: function(date) {
      return moment(date).subtract(2, "weeks");
    }
  }
};
</script>

<style>
.container {
  display: flex;
}

.container > div {
  padding: 30px;
}
</style>
