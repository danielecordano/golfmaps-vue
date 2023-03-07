<template>
  <v-file-input
    label="File input"
    v-model="file"
    @change="uploadFile"
  ></v-file-input>
</template>
<script>
import { API, graphqlOperation } from "aws-amplify";
import { createCourse } from "../graphql/mutations";

export default {
  data() {
    return {
      file: null,
    };
  },
  methods: {
    uploadFile: function () {
      const router = this.$router;
      if (this.file) {
        const r = new FileReader();
        r.onload = function (e) {
          const contents = e.target.result;
          const courses = JSON.parse(contents);
          courses.forEach(async (course) => {
            try {
              await API.graphql(
                graphqlOperation(createCourse, { input: course })
              );
            } catch (error) {
              alert(error);
            }
          });
          router.push("/mycourses");
        };
        r.readAsText(this.file);
      } else {
        alert("No file");
      }
    },
  },
};
</script>