<template>
  <v-app>
    <v-container>
      <v-row class="mb-6" no-gutters>
        <v-col md="4">
          <h3 class="title">My Courses</h3>
        </v-col>
        <router-link to="/" class="no-decoration">All courses</router-link>
      </v-row>
      <v-text-field
        label="Search my courses"
        placeholder="Course name"
        prepend-icon="mdi-magnify"
        v-model="search"
        @input="fetch"
      ></v-text-field>
      <div v-if="loading">
        <v-progress-linear indeterminate color="orange"></v-progress-linear>
      </div>
      <div v-else-if="courses">
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
            class="no-decoration"
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
import { Auth, API } from "aws-amplify";
import { listCourses } from "../graphql/queries";
export default {
  data() {
    return {
      user: undefined,
      courses: [],
      loading: true,
      search: "",
    };
  },
  created() {
    if (this.user === undefined) {
      Auth.currentAuthenticatedUser()
        .then((authData) => {
          this.user = authData;
          this.fetch();
        })
        .catch((error) => console.log(error));
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      const filter = {
        and: [
          {
            name: {
              contains: this.search.toLowerCase(),
            },
          },
          {
            owner: {
              eq: this.user.username,
            },
          },
        ],
      };
      const response = await API.graphql({
        query: listCourses,
        variables: {
          filter: filter,
          limit: 1000,
        },
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
.fit {
  width: fit-content;
}
</style>