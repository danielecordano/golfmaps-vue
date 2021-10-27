<template>
  <div id="course" @keyup.left="prev" @keyup.right="next">
    <v-app-bar-nav-icon
      @click="drawer = true"
      class="menu"
    ></v-app-bar-nav-icon>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <Course
      v-else-if="course"
      :holes="course.holes"
      :isImperial="isImperial"
      :selected="selected"
      @path-changed="handlePathChanged"
      @path-clicked="handlePathClicked"
      @map-clicked="handleMapClicked"
      @map-keyboard-left="prev"
      @map-keyboard-right="next"
    />
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list dense>
        <v-text-field label="Name" v-model="course.name"></v-text-field>
        <v-list-item
          link
          @click="
            next();
            drawer = false;
          "
        >
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Next hole</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          @click="
            prev();
            drawer = false;
          "
        >
          <v-list-item-icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Previous hole</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list dense>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <router-link to="/">Search a course</router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list v-if="user">
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div>{{ user.attributes.email }}</div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <router-link to="/import">Import</router-link>
          </v-list-item-content>
        </v-list-item>
        <div v-if="course">
          <div v-if="course.owner === user.username">
            <v-list-item
              link
              @click="
                save();
                drawer = false;
              "
            >
              <v-list-item-icon>
                <v-icon>mdi-content-save</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Save</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              @click="
                remove();
                drawer = false;
              "
            >
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-list-item
            link
            @click="
              fork();
              drawer = false;
            "
          >
            <v-list-item-icon>
              <v-icon>mdi-source-fork</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Fork</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <amplify-sign-out button-text="Log out"></amplify-sign-out>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <router-link to="/auth">Login</router-link>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { Auth } from "aws-amplify";
import { AuthState } from "@aws-amplify/ui-components";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import { API, graphqlOperation } from "aws-amplify";
import { updateCourse, createCourse, deleteCourse } from "../graphql/mutations";
import { getCourse } from "../graphql/queries";
import Course from "./Course.vue";
export default {
  name: "CourseWithControls",
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      drawer: false,
      loading: true,
      error: null,
      course: null,
      isImperial: true,
      selected: 0,
    };
  },
  async mounted() {
    const response = await API.graphql({
      query: getCourse,
      variables: { id: this.$route.params.id },
      authMode: "API_KEY",
    });
    this.course = response.data.getCourse;
    this.loading = false;
  },
  created() {
    if (this.authState === undefined) {
      Auth.currentAuthenticatedUser()
        .then((authData) => {
          this.authState = AuthState.SignedIn;
          this.user = authData;
        })
        .catch((error) => console.log(error));
    }
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  beforeDestroy() {
    this.unsubscribeAuth();
  },
  methods: {
    next: function () {
      this.selected = (this.selected + 19) % 18;
    },
    prev: function () {
      this.selected = (this.selected + 17) % 18;
    },
    save: async function () {
      try {
        await API.graphql(
          graphqlOperation(updateCourse, {
            input: {
              id: this.course.id,
              holes: this.course.holes,
              name: this.course.name,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
    },
    remove: async function () {
      try {
        await API.graphql(
          graphqlOperation(deleteCourse, {
            input: {
              id: this.course.id,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
      this.$router.push("/");
    },
    fork: async function () {
      let response = undefined;
      try {
        response = await API.graphql(
          graphqlOperation(createCourse, {
            input: {
              name: this.course.name,
              holes: this.course.holes,
              owner: this.user.username,
            },
          })
        );
      } catch (error) {
        console.log(error);
      }
      console.log(response);
    },
    handlePathClicked: function ({ event, index }) {
      if (event.vertex) {
        const oldPath = this.course.holes[index];
        if (oldPath.length > 1) {
          this.$set(
            this.course.holes,
            index,
            oldPath.filter((v, i) => i !== event.vertex)
          );
        }
      } else {
        this.selected = index;
        console.log(index);
      }
    },
    handlePathChanged: function ({ path, index }) {
      const newPath = path.getArray().map((v) => v.toJSON());
      this.$set(this.course.holes, index, newPath);
    },
    handleMapClicked: function (e) {
      const point = e.latLng.toJSON();
      this.course.holes[this.selected].push(point);
    },
  },
  components: {
    Course,
  },
};
</script>
<style scoped>
.menu {
  position: absolute;
  z-index: 1;
  background: white;
}
</style>