<template>
  <v-container>
    <v-btn icon @click="$router.go(-1)">
      <v-icon> mdi-arrow-left </v-icon>
    </v-btn>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        ref="name"
        v-model="name"
        :rules="[() => !!name || 'This field is required']"
        label="Name"
        placeholder="Name"
        required
      ></v-text-field>
      <v-text-field
        ref="lat"
        v-model="lat"
        :rules="[
          () => !!lat || 'This field is required',
          () =>
            (!!lat && !isNaN(parseFloat(lat))) ||
            'This field must be a decimal number',
          () =>
            (!!lat && parseFloat(lat) > -90 && parseFloat(lat) < 90) ||
            'This field must be between -90 and 90',
        ]"
        label="Latitude"
        placeholder="45"
        required
      ></v-text-field>
      <v-text-field
        ref="lng"
        v-model="lng"
        :rules="[
          () => !!lng || 'This field is required',
          () =>
            (!!lng && !isNaN(parseFloat(lng))) ||
            'This field must be a decimal number',
          () =>
            (!!lng && parseFloat(lng) > -180 && parseFloat(lng) < 180) ||
            'This field must be between -180 and 180',
        ]"
        label="Longitude"
        placeholder="0"
        required
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="orange" text @click="submit"> Create </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { createCourse } from "../graphql/mutations";
export default {
  name: "playground",
  data: () => ({
    valid: false,
    name: "",
    lat: "",
    lng: "",
    holes: [],
  }),
  methods: {
    create: async function () {
      try {
        const response = await API.graphql(
          graphqlOperation(createCourse, {
            input: {
              name: this.name.toLowerCase(),
              holes: this.holes,
            },
          })
        );
        const id = response.data.createCourse.id;
        this.$router.push(`/course/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    submit() {
      if (!this.$refs.form.validate()) return;
      const firstHole = [
        {
          lat: parseFloat(this.lat),
          lng: parseFloat(this.lng),
        },
      ];
      this.holes = [
        firstHole,
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ];
      this.create();
    },
  },
};
</script>
