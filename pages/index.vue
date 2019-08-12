<template>
  <div>
		<ul>
			<li v-for="tag in repository.refs.tags" :key="tag.node.tag.id">{{ tag.node.tag }}</li>
		</ul>
		<button @click="logIt()" type="button" name="button">Console this 💩</button>
  </div>
</template>

<script>
import tags from '~/apollo/queries/tags'

export default {
  apollo: {
    repository: {
      query: tags
    }
  },
	data: {
		repository: null
	},
	methods: {
		logIt: function() {
			console.log(this.repository.refs.tags[0].node.tag.commit.committedDate);
		}
	}
}
</script>

<style>

</style>
