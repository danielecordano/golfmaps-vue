<template>
  <div id="course">
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
    />
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list dense>
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
            <v-list-item-title>Next</v-list-item-title>
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
            <v-list-item-title>Previous</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list v-if="user">
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div>
              <div>Hello, {{ user.attributes.email }}</div>
              <amplify-sign-out button-text="Log out"></amplify-sign-out>
            </div>
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
  mounted() {
    this.course = JSON.parse(
      '{"owner":"844f84e6-3316-4f36-98af-a77437d70161","holes":[[{"lat":33.50240163022168,"lng":-82.01992609325407},{"lat":33.503549688631146,"lng":-82.02236641237255},{"lat":33.50448265178307,"lng":-82.02351927116393}],[{"lat":33.50473,"lng":-82.02422000000001},{"lat":33.502424523077224,"lng":-82.02480500859832},{"lat":33.50089,"lng":-82.02398},{"lat":33.50038,"lng":-82.02350999999999}],[{"lat":33.4997900496169,"lng":-82.02340413988111},{"lat":33.50098,"lng":-82.02512100000001},{"lat":33.50171836954023,"lng":-82.02601072883607}],[{"lat":33.50201,"lng":-82.02555},{"lat":33.50189,"lng":-82.02798}],[{"lat":33.50182,"lng":-82.02826},{"lat":33.49957,"lng":-82.02834},{"lat":33.49838,"lng":-82.02743}],[{"lat":33.49885,"lng":-82.02731},{"lat":33.50035163097077,"lng":-82.02684390674591}],[{"lat":33.50091,"lng":-82.02742},{"lat":33.5001,"lng":-82.02508},{"lat":33.4995,"lng":-82.02335}],[{"lat":33.49921,"lng":-82.02238},{"lat":33.50142,"lng":-82.02325000000002},{"lat":33.50317632598679,"lng":-82.02339344047545},{"lat":33.50372,"lng":-82.02371}],[{"lat":33.504483408685445,"lng":-82.02404880027768},{"lat":33.502585620572546,"lng":-82.0221605251312},{"lat":33.50231654497054,"lng":-82.02064887962342}],[{"lat":33.50198209240804,"lng":-82.01976460615157},{"lat":33.499599191472896,"lng":-82.02066099140166},{"lat":33.49805,"lng":-82.02044}],[{"lat":33.49855,"lng":-82.01931},{"lat":33.49648,"lng":-82.02068},{"lat":33.4952,"lng":-82.02217}],[{"lat":33.49561,"lng":-82.02242000000001},{"lat":33.49450684158007,"lng":-82.0231786203509}],[{"lat":33.49409,"lng":-82.02351},{"lat":33.49639,"lng":-82.02367},{"lat":33.49704,"lng":-82.02481},{"lat":33.49712,"lng":-82.0256}],[{"lat":33.49755,"lng":-82.02563},{"lat":33.49729,"lng":-82.02283},{"lat":33.49747,"lng":-82.02135}],[{"lat":33.49764,"lng":-82.02056},{"lat":33.49839,"lng":-82.02349},{"lat":33.49873,"lng":-82.02477},{"lat":33.49893,"lng":-82.02559}],[{"lat":33.49829,"lng":-82.02579},{"lat":33.49957,"lng":-82.02647}],[{"lat":33.499890609828306,"lng":-82.02631854232789},{"lat":33.49911,"lng":-82.0238},{"lat":33.49879,"lng":-82.02217000000002}],[{"lat":33.49832,"lng":-82.02165},{"lat":33.500752043025905,"lng":-82.02143291534423},{"lat":33.50188,"lng":-82.02052}]],"name":"augusta national"}'
    );
    this.loading = false;
  },
  created() {
    if (this.authState === undefined) {
      Auth.currentAuthenticatedUser().then((authData) => {
        this.authState = AuthState.SignedIn;
        this.user = authData;
      });
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
    handlePathClicked: function ({ event, index }) {
      if (event.vertex) {
        const oldPath = this.course.holes[index];
        if (oldPath.length > 2) {
          this.course.holes[index] = oldPath.filter(
            (v, i) => i !== event.vertex
          );
        }
      } else {
        this.selected = index;
      }
    },
    handlePathChanged: function ({ path, index }) {
      this.course.holes[index] = path.getArray().map((v) => v.toJSON());
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