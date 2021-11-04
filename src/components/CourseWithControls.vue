<template>
  <div id="course" @keyup.left="prev" @keyup.right="next">
    <v-app>
      <v-app-bar-nav-icon
        v-if="course"
        @click="drawer = true"
        class="menu"
      ></v-app-bar-nav-icon>
      <div v-if="loading">
        <v-progress-linear indeterminate color="orange"></v-progress-linear>
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
      <Course
        v-else-if="course"
        :center="center"
        :holes="course.holes"
        :isImperial="isImperial"
        :selected="selected"
        @path-changed="handlePathChanged"
        @path-clicked="handlePathClicked"
        @map-clicked="handleMapClicked"
        @map-keyboard-left="prev"
        @map-keyboard-right="next"
        class="fullheight"
      />
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list>
          <v-list-item v-if="course" link>
            <v-list-item-icon>
              <v-icon>mdi-lead-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-text-field
                v-model="course.name"
                label="Course name"
                placeholder="name"
              >
              </v-text-field>
            </v-list-item-content>
          </v-list-item>
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
          <v-list-item
            link
            @click="
              isImperial = !isImperial;
              drawer = false;
            "
          >
            <v-list-item-icon>
              <v-icon>mdi-ruler</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ isImperialLabel }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list v-if="course">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-weather-sunny</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <a :href="weatherUrl" target="_blank" class="link">Weather</a>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to="/" class="link">Search a course</router-link>
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-title v-bind="attrs" v-on="on">{{
                    user.attributes.email
                  }}</v-list-item-title>
                </template>
                <span>{{ user.attributes.email }}</span>
              </v-tooltip>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link to="/mycourses" class="link">My courses</router-link>
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
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-folder-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <router-link to="/new" class="link"
                  >Create new course</router-link
                >
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
              <router-link
                :to="{
                  path: '/auth',
                  query: { redirect: $router.currentRoute.path },
                }"
                class="link"
                >Login</router-link
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-app>
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
      center: null,
    };
  },
  computed: {
    isImperialLabel() {
      return this.isImperial
        ? "Change to metric units"
        : "Change to imperial units";
    },
    weatherUrl() {
      if (this.course) {
        const ll = this.center;
        const q = ll.lat.toFixed(3) + "," + ll.lng.toFixed(3);
        const url = "https://weather.com/weather/today/l/" + q;
        return url;
      }
      return "#";
    },
  },
  async mounted() {
    const response = await API.graphql({
      query: getCourse,
      variables: { id: this.$route.params.id },
      authMode: "API_KEY",
    });
    const course = response.data.getCourse;
    course.holes.every((hole) => {
      if (hole[0]) {
        this.center = { ...hole[0] };
        return false;
      } else {
        return true;
      }
    });
    if (!this.center) this.center = { lat: 33.50239, lng: -82.01995 };
    this.course = course;
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
              name: this.course.name.toLowerCase(),
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
      try {
        const response = await API.graphql(
          graphqlOperation(createCourse, {
            input: {
              name: this.course.name.toLowerCase(),
              holes: this.course.holes,
            },
          })
        );
        const id = response.data.createCourse.id;
        this.$route.push(`/course/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    handlePathClicked: function ({ event, index }) {
      if (event.vertex || event.vertex === 0) {
        const oldPath = this.course.holes[index];
        this.$set(
          this.course.holes,
          index,
          oldPath.filter((v, i) => i !== event.vertex)
        );
      } else {
        this.selected = index;
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
.fullheight {
  position: fixed;
  height: 100%;
}
.menu {
  position: absolute;
  z-index: 1;
  background: white;
}
.link {
  text-decoration: none;
  color: black;
}
</style>