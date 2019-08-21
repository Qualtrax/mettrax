<template>
  <div>
		<h1>Major Releases Within The Last Year</h1>
		<ul>
      <li v-for="(tag, index) in tags" :key="index">
          {{ tag.name }} - {{ formatDate(tag.commitDate) }}
      </li>
    </ul>
		<h1>Commits Within The Last Year</h1>
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
			tags: ''
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
		const getTags = fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer xx`
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

			const today = moment(new Date());
			const majorTagsWithinTheLastYear = tags.filter(tag => tag.isMajor && today.diff(tag.commitDate, 'years') == 0);

			return { tags: majorTagsWithinTheLastYear }
		});

		// const getCommits = `query GetCommits($owner: String!, $name: String!, $date: GitTimestamp!){
		//   repository(owner: $owner, name: $name) {
		//     defaultBranchRef {
		//       target {
		//         ... on Commit {
		//           history(since: $date) {
		//             totalCount
		//             commits: edges {
		//               commit: node {
		//                 ... on Commit {
		//                   committedDate
		//                   messageHeadline
		//                 }
		//               }
		//             }
		//             pageInfo {
		//               endCursor
		//               hasNextPage
		//             }
		//           }
		//         }
		//       }
		//     }
		//   }
		// }`;
		//
		// fetch('https://api.github.com/graphql', {
		//   method: 'POST',
		//   headers: {
		//       'Content-Type': 'application/json',
		//       'Accept': 'application/json',
		//       'Authorization': `Bearer xx`
		//   },
		//   body: JSON.stringify({
		//     query: getCommits,
		//     variables: { owner, name, today }
		//   })
		// })
		// .then(r => r.json())
		// .then(data => {
		// 	console.log('howdy');
		// 	console.log(data);
		// });

		return Promise.all([getTags])
			.then(values => {
					return { tags: values[0].tags}
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
