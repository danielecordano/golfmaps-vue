<template>
  <v-app>
    <v-container>
      <v-text-field
        label="Search all courses"
        placeholder="Course name"
        prepend-icon="mdi-magnify"
        v-model="search"
        @input="fetch"
      ></v-text-field>
      <div v-if="loading">
        <v-progress-linear indeterminate color="orange"></v-progress-linear>
      </div>
      <div v-else class="bottom">
        <v-list>
          <v-list-item
            link
            v-for="course in courses"
            :key="course.id"
            class="fit"
          >
            <v-list-item-content>
              <router-link :to="`/course/${course.id}`" class="no-decoration">{{
                course.name
              }}<span class="grey-text"> created <TimeAgo :timestamp="course.createdAt" /></span></router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn v-if="nextToken" @click="loadMore">Load more</v-btn>
      </div>
    </v-container>
    <Footer />
  </v-app>
</template>
<script>
import { API } from "aws-amplify";
import { searchCourses } from "../graphql/queries";
import TimeAgo from "./TimeAgo";
import Footer from "./Footer";

export default {
  data() {
    return {
      courses: [],
      loading: true,
      search: "",
      sort: {
        "field": "name",
        "direction": "asc"
      },
      nextToken: null
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const filter = {
        name: {
          match: this.search.toLowerCase()
        }
      };
      const response = await API.graphql({
        query: searchCourses,
        variables: {
          filter,
          sort: this.sort
        },
        authMode: "AWS_IAM",
      });
      // eslint-disable-next-line
      console.log(response);
      this.courses = response.data.searchCourses.items;
      this.nextToken = response.data.searchCourses.nextToken;
      this.loading = false;
    },
    async loadMore() {
      this.loading = true;
      const filter = {
        name: {
          match: this.search.toLowerCase()
        }
      };
      const response = await API.graphql({
        query: searchCourses,
        variables: {
          filter,
          sort: this.sort,
          nextToken: this.nextToken
        },
        authMode: "AWS_IAM",
      });
      this.courses = this.courses.concat(response.data.searchCourses.items);
      this.nextToken = response.data.searchCourses.nextToken;
      this.loading = false;
    }
  },
  components: {
    TimeAgo,
    Footer,
  },
};
</script>
<style scoped>
.no-decoration {
  text-decoration: none;
}
.fit {
  width: fit-content;
}
.bottom {
  margin-bottom: 130px;
}
.grey-text {
  color: grey;
}
</style>