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
      </div>
    </v-container>
    <Footer />
  </v-app>
</template>
<script>
import { API } from "aws-amplify";
import { listCourses } from "../graphql/queries";
import TimeAgo from "./TimeAgo";
import Footer from "./Footer";

export default {
  data() {
    return {
      courses: [],
      loading: true,
      search: "",
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
          contains: this.search.toLowerCase(),
        },
      };
      const response = await API.graphql({
        query: listCourses,
        variables: {
          filter: filter,
          limit: 100,
        },
        authMode: "AWS_IAM",
      });
      let courses = response.data.listCourses.items;
      let nextToken = response.data.listCourses.nextToken;
      while (nextToken) {
        let page = await API.graphql({
          query: listCourses,
          variables: {
            filter: filter,
            limit: 100,
            nextToken: nextToken,
          },
          authMode: "AWS_IAM",
        });
        courses = courses.concat(page.data.listCourses.items);
        nextToken = page.data.listCourses.nextToken;
      }
      this.courses = courses.sort(this.sortByName);
      this.loading = false;
    },
    sortByName(a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
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