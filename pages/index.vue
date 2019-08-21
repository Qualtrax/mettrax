<template>
  <div>
	<h1>Major Releases Within The Last Year</h1>
	<ul>
      <li v-for="(tag, index) in tags" :key="index">
          {{ tag.name }} - {{ formatDate(tag.commitDate) }}
      </li>
    </ul>
	<h1>Commits Within The Last Year</h1>
	<ul>
		<li v-for="(commit, index) in commits" :key="index">
			{{ commit.commit.messageHeadline }} - {{ formatDate(commit.commit.committedDate) }}
		</li>
	</ul>
  </div>
</template>

<script>
import tags from '~/apollo/queries/tags';
import repository from '~/apollo/queries/repositoryQuery';
import issuesByDates from '~/apollo/queries/issues';
import moment from 'moment';
import axios from 'axios'

export default {
	data: function() {
		return {
			tags: '',
			commits: ''
		};
	},
	asyncData ({ req, params }) {
		const owner = "Qualtrax";
		const name = "Qualtrax";

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

		const today = moment(new Date());

		const getTags = fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer 9aa300a7a0834c1425a0ba2d54beafa3c3027999`
			},
			body: JSON.stringify({
			query: getReleases,
			variables: { owner, name }
			})
		})
		.then(r => r.json())
		.then((response) => {
			const responseTags = response.data.repository.refs.tags.filter(element => element.node.tag.name != undefined);
			const tags = responseTags.map(element => {
				return {
					id: element.node.tag.id,
					name: element.node.tag.name,
					commitDate: element.node.tag.commit != undefined ? moment(element.node.tag.commit.committedDate) : '',
					isMajor: element.node.tag != undefined ? element.node.tag.name.split('.')[3] == '0' : ''
				}
			});

			const majorTagsWithinTheLastYear = tags.filter(tag => tag.isMajor && today.diff(tag.commitDate, 'years') == 0);

			return { tags: majorTagsWithinTheLastYear }
		});

		const oneYearAgo = today.subtract(1, 'years');
		const getCommitsWithinLastYear = fetch('https://api.github.com/graphql', {
		  method: 'POST',
		  headers: {
		      'Content-Type': 'application/json',
		      'Accept': 'application/json',
		      'Authorization': `Bearer 9aa300a7a0834c1425a0ba2d54beafa3c3027999`
		  },
		  body: JSON.stringify({
		    query: getCommits,
		    variables: { owner, name, date: today.subtract(1, 'years')}
		  })
		})
		.then(r => r.json())
		.then(data => {
			console.log(data.data.repository.defaultBranchRef.target.history.commits);
			return { commits: data.data.repository.defaultBranchRef.target.history.commits }
		});

		return Promise.all([getTags, getCommitsWithinLastYear])
		.then(values => {
			console.log(values);
			return { 
				tags: values[0].tags,
				commits: values[1].commits
			}
		});
	},
	methods: {
		formatDate: function(date) {
			return moment(date).format("MMM Do YYYY");
		}
	}
}
</script>

<style>

</style>
