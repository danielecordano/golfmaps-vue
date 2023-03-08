<template>
  <div @keyup.left="prev" @keyup.right="next">
    <v-app>
      <v-app-bar-nav-icon
        v-if="course"
        @click="drawer = true"
        class="menu"
      ></v-app-bar-nav-icon>
      <div v-if="course && user" class="like">
        <v-icon v-if="!liked" color="red" size="64" @click="like">mdi-heart-outline</v-icon>
        <v-icon v-else color="red" size="64" @click="unlike">mdi-heart</v-icon>
        <div class="red-transparent">{{ this.likesCount }}</div>
      </div>
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
        class="full-height"
      />
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <div v-if="course">
          <v-list>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-lead-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-form v-model="valid">
                  <v-text-field
                    v-model="course.name"
                    label="Course name"
                    placeholder="name"
                    :rules="rules.name"
                  >
                  </v-text-field>
                </v-form>
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
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-golf</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <select v-model="selected" @change="drawer = false">
                    <option
                      v-for="(hole, i) in course.holes"
                      :value="i"
                      :key="i"
                    >
                      Go to hole {{ i + 1 }}
                    </option>
                  </select>
                </v-list-item-title>
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
          <v-list>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-weather-sunny</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <a :href="weatherUrl" target="_blank" class="link">Weather</a>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
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
            <div v-if="isOwner || isAdmin">
              <v-list-item
                link
                :disabled="!valid"
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
              :disabled="!valid"
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
          <v-list-item link @click="signOut">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
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
                  query: { nextUrl: $router.currentRoute.path },
                }"
                class="link"
                >Login</router-link
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>     
              <a
                href="https://www.buymeacoffee.com/danielecordano"
                target="_blank"
                class="link"
              >Donate</a>
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
import { API, graphqlOperation } from "aws-amplify";
import { updateCourse, createCourse, deleteCourse, likeCourse, unlikeCourse } from "../graphql/mutations";
import { getCourse } from "../graphql/queries";
import Course from "./Course.vue";
export default {
  name: "CourseWithControls",
  data() {
    return {
      user: undefined,
      authState: undefined,
      drawer: false,
      loading: true,
      error: null,
      course: null,
      isImperial: true,
      selected: 0,
      center: null,
      valid: false,
      rules: {
        name: [(val) => (val || "").length > 0 || "This field is required"],
      },
      liking: false,
    };
  },
  computed: {
    isImperialLabel() {
      return this.isImperial ? "Use metric units" : "Use imperial units";
    },
    weatherUrl() {
      if (this.center) {
        const ll = this.center;
        const q = ll.lat.toFixed(3) + "," + ll.lng.toFixed(3);
        const url = "https://weather.com/weather/today/l/" + q;
        return url;
      }
      return "#";
    },
    isOwner() {
      if (this.course && this.user) {
        return this.course.owner === this.user.username;
      }
      return false;
    },
    isAdmin() {
      if (this.course && this.user) {
        const groups = this.user.signInUserSession.accessToken.payload[
          "cognito:groups"
        ];
        if (groups) {
          return groups.includes("Admins");
        }
      }
      return false;
    },
    liked(){
      if (this.course)
        if (this.course.likes)
          if (this.course.likes.includes(this.user.username))
            return true;
      return false;
    },
    likesCount(){
      const formatter = Intl.NumberFormat('en', { notation: 'compact' });
      return this.course.likes ? formatter.format(this.course.likes.length) : 0;
    }
  },
  async mounted() {
    const response = await API.graphql({
      query: getCourse,
      variables: { id: this.$route.params.id },
      authMode: "AWS_IAM",
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
        .catch(() => {
          this.user = undefined;
        });
    }
  },
  methods: {
    next: function () {
      this.selected = (this.selected + 19) % 18;
    },
    prev: function () {
      this.selected = (this.selected + 17) % 18;
    },
    like: async function () {
      if (this.liking)
        return;
      this.liking = true;
      try {
        const response = await API.graphql(
          graphqlOperation(likeCourse, {
            courseId: this.course.id
            }
          ));
        this.course.likes = response.data.likeCourse;
      } catch(error) {
        alert("Like failed. " + error.message);
      }
      this.liking = false;
    },
    unlike: async function () {
      if (this.liking)
        return;
      this.liking = true;
      try {
        const response = await API.graphql(
          graphqlOperation(unlikeCourse, {
            courseId: this.course.id
            }
          ));
        this.course.likes = response.data.unlikeCourse;
      } catch(error) {
        alert("Like failed. " + error.message);
      }
      this.liking = false;
    },
    save: async function () {
      try {
        await API.graphql(
          graphqlOperation(updateCourse, {
            input: {
              id: this.course.id,
              holes: this.course.holes,
              name: this.course.name.toLowerCase(),
              likes: this.course.likes
            },
          })
        );
      } catch(error) {
        alert("Save failed. " + error.message);
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
      } catch(error) {
        alert("Delete failed. " + error.message);
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
        await this.$router.push({ path: "/mycourses" });
        await this.$router.push({ path: `/course/${id}` });
      } catch(error) {
        alert("Fork failed. " + error.message);
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
    signOut: async function () {
      try {
        await Auth.signOut();
        this.authState = AuthState.SignedOut;
        this.user = undefined;
      } catch (error) {
        alert("Error signing out: ", error.message);
      }
    },
  },
  components: {
    Course,
  },
};
</script>
<style scoped>
.full-height {
  position: fixed;
  height: 100%;
}
.menu {
  position: absolute;
  z-index: 1;
  background: white;
  width: 64px;
  height: 64px;
}
.like {
  position: fixed;
  z-index: 5;
  right: 0;
  bottom: 32px;
  display: block;
  margin: 0;
  padding: 0;
}
.red-transparent{
  font-size: 32px;
  color: red;
  background-color: transparent;
  width: fit-content;
  margin: auto;
}
.link {
  text-decoration: none;
  color: black;
}
</style>