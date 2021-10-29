<template>
  <v-container>
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
import { Auth } from "aws-amplify";
import { AuthState } from "@aws-amplify/ui-components";
import { API, graphqlOperation } from "aws-amplify";
import { createCourse } from "../graphql/mutations";
export default {
  name: "playground",
  data: () => ({
    user: undefined,
    authState: undefined,
    name: "",
    lat: "",
    lng: "",
    holes: [],
  }),
  created() {
    if (this.authState === undefined) {
      Auth.currentAuthenticatedUser()
        .then((authData) => {
          this.authState = AuthState.SignedIn;
          this.user = authData;
        })
        .catch((error) => console.log(error));
    }
  },
  methods: {
    create: async function () {
      try {
        const response = await API.graphql(
          graphqlOperation(createCourse, {
            input: {
              name: this.name,
              holes: this.holes,
              owner: this.user.username,
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
