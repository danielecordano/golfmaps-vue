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
      <div v-else class="fill-height">
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
              }}</router-link>
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
          limit: 1000,
        },
        authMode: "AWS_IAM",
      });
      this.courses = response.data.listCourses.items.sort(function (a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
      this.loading = false;
    },
  },
  components: {
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
  margin-top: auto;
}
</style>