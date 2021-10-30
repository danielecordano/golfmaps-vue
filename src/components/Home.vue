<template>
  <v-app>
    <v-container>
      <v-text-field
        label="Search"
        prepend-icon="mdi-magnify"
        v-model="search"
        @input="fetch"
      ></v-text-field>
      <div v-if="loading">
        <v-progress-linear indeterminate color="orange"></v-progress-linear>
      </div>
      <div v-else>
        <v-list>
          <v-list-item link v-for="course in courses" :key="course.id">
            <v-list-item-content>
              <router-link :to="`/course/${course.id}`" class="no-decoration">{{
                course.name
              }}</router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-container>
    <v-footer dark padless fixed>
      <v-card
        flat
        tile
        class="orange lighten-1 white--text text-center full-width"
      >
        <v-card-text>
          <a
            href="https://twitter.com/golfmapsinfo"
            target="_blank"
            class="nodecoration"
          >
            <v-btn class="mx-4 white--text" icon>
              <v-icon size="24px"> mdi-twitter </v-icon>
            </v-btn>
          </a>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Golfmaps</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>
<script>
import { API } from "aws-amplify";
import { listCourses } from "../graphql/queries";
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
        authMode: "API_KEY",
      });
      this.courses = response.data.listCourses.items.sort(function (a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.no-decoration {
  text-decoration: none;
}
.full-width {
  width: 100%;
}
</style>