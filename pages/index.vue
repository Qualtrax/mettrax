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
            >{{ issue.node.number }} - {{ issue.node.title }}</li>
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
  async asyncData({ req, params }) {
    const owner = "Qualtrax";
    const qualtraxRepo = "Qualtrax";
    const qualtraxWebRepo = "qualtrax-web";
		const apiToken = "xx";

    const getReleases = `query GetReleases($owner: String!, $name: String!){
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
    const getCommits = `query GetCommits($owner: String!, $name: String!, $date: GitTimestamp!, $after: String){
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

    const getTags = async function() {
			return fetch("https://api.github.com/graphql", {
	      method: "POST",
	      headers: {
	        "Content-Type": "application/json",
	        Accept: "application/json",
	        Authorization: `Bearer ${apiToken}`
	      },
	      body: JSON.stringify({
	        query: getReleases,
	        variables: { owner, name: qualtraxRepo }
	      })
	    })
			.then(r => r.json());
		};

		const tagsResponse = await getTags();
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
          element.node.tag != undefined
            ? isMajorTag(element.node.tag.name)
            : ""
      };
    });

		const todaysDate = new Date();
    const majorTagsWithinTheLastYear = allTags.filter(
      tag => {
				return tag.commitDate.diff(todaysDate, "years") >= 0;
			}
    );
    const tags = majorTagsWithinTheLastYear.sort(
      (a, b) => a.commitDate < b.commitDate
    );

      // });

    const oneYearAgo = today.subtract(1, "years");
    const getCommitsWithinLastYear = async function(cursor) {
			return fetch("https://api.github.com/graphql", {
	      method: "POST",
	      headers: {
	        "Content-Type": "application/json",
	        Accept: "application/json",
	        Authorization: `Bearer ${apiToken}`
	      },
	      body: JSON.stringify({
	        query: getCommits,
	        variables: { owner, name: qualtraxRepo, date: oneYearAgo.toDate(), after: cursor}
	      })
	    })
			.then(r => r.json());
		};

		let allCommits = [];
		let hasNextPage = true;
		let cursor = null;

		while(hasNextPage) {
			let commitsResponse = await getCommitsWithinLastYear(cursor);
			allCommits.push(...commitsResponse.data.repository.defaultBranchRef.target.history.commits);

			cursor = commitsResponse.data.repository.defaultBranchRef.target.history.pageInfo.endCursor;
			hasNextPage = commitsResponse.data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage;
		}

    const commitsWithIssueNumbers = allCommits.filter(
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

    const getMilestonesWithinLastYear = async function() {
			return fetch(
	      "https://api.github.com/graphql",
	      {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	          Accept: "application/json",
	          Authorization: `Bearer ${apiToken}`
	        },
	        body: JSON.stringify({
	          query: getMilestones,
	          variables: { owner, qualtraxRepo, qualtraxWebRepo }
	        })
	      }
	    )
      .then(r => r.json());
		};
		const milestonesResponse = await getMilestonesWithinLastYear();
		const qualtraxEdges = milestonesResponse.data.qualtraxRepo.milestones.edges;
		const qualtraxWebEdges = milestonesResponse.data.qualtraxWebRepo.milestones.edges;
		const combinedRepos = qualtraxEdges.concat(qualtraxWebEdges);
    const withinLastYear = combinedRepos.filter(milestone => {
      return today.diff(milestone.node.dueOn, "years") <= 0;
    });
		const milestones = withinLastYear.sort((a, b) => a.node.dueOn < b.node.dueOn);

		return {
			tags,
			milestones,
			commits
		};
  },
  methods: {
    formatDate: function(date) {
      return moment(date).format("MMM Do YYYY");
    },
    twoWeeksAgo: function(date) {
			// milestone start date will be 1 week for ghweb < 42
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
