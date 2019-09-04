<template>
  <div>
    <div>
      <h1>Combined</h1>
      <ul>
        <li v-for="(tag, index) in commitsPerTag" :key="index">
          <b>{{ tag.name }}</b>
          - {{ formatDate(tag.commitDate) }}
          <ul>
            <li
              v-for="(issue, commitIndex) in tag.issues"
              :key="commitIndex"
            >{{ issue.messageHeadline }} - {{ formatDate(issue.committedDate) }}</li>
          </ul>
        </li>
      </ul>
    </div>
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
  </div>
</template>

<script>
import moment from "moment";
import gitHubService from "../services/gitHubService";

export default {
  data: function() {
    return {
      tags: "",
      commits: "",
      milestones: "",
      commitsPerTag: ""
    };
  },
  async asyncData({ req, params }) {
    const today = moment(new Date());
    const oneYearAgo = today.subtract(1, "years");

    const tags = await gitHubService.getTagsSince(null);
    const milestones = await gitHubService.getMilestonesSince(null);
    const commits = await gitHubService.getCommitsSince(oneYearAgo);
    const commitsPerTag = gitHubService.combineTagsWithCommits(tags, commits);

    return {
      tags,
      milestones,
      commits,
      commitsPerTag
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
