<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <v-text-field
      label="Search"
      append-icon="mdi-magnify"
      v-model="search"
    ></v-text-field>
    <v-list>
      <v-list-item link v-for="course in filteredCourses" :key="course.id">
        <v-list-item-content>
          <router-link :to="`/course/${course.id}`" class="nodecoration">{{
            course.name
          }}</router-link>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
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
  async mounted() {
    const response = await API.graphql({
      query: listCourses,
      variables: {
        limit: 1000,
      },
      authMode: "API_KEY",
    });
    this.courses = response.data.listCourses.items.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
    console.log(this.courses);
    this.loading = false;
  },
  computed: {
    filteredCourses() {
      const search = this.search.toLowerCase();
      if (!search) return this.courses;
      return this.courses.filter((c) => c.name.includes(search));
    },
  },
};
</script>
<style scoped>
.nodecoration {
  text-decoration: none;
}
</style>