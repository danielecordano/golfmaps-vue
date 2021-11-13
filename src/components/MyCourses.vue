<template>
  <v-app>
    <v-container>
      <v-row class="mb-6" no-gutters>
        <v-col md="4">
          <h3 class="title">My Courses</h3>
        </v-col>
        <v-spacer />
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
      <div v-else-if="courses" class="fill-height">
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
import { Auth, API } from "aws-amplify";
import { listCourses } from "../graphql/queries";
import Footer from "./Footer.vue";
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
  components: {
    Footer,
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