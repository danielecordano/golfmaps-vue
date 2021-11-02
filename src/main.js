import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueRouter from "vue-router";

import Home from "./components/Home";
import CourseWithControls from "./components/CourseWithControls";
import AuthComponent from "./components/AuthComponent";
import ImportCourses from "./components/ImportCourses";
import NewCourse from "./components/NewCourse";
import MyCourses from "./components/MyCourses";

import * as GmapVue from "gmap-vue";
import "@aws-amplify/ui-vue";
import { Auth } from "aws-amplify";
import Amplify, { Analytics } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
Analytics.record({ name: "main" });

const opts = {
  icons: {
    iconfont: "mdi"
  }
};
Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(GmapVue, {
  load: {
    key: "AIzaSyC4Wf6YgqgaqXtaHACUYyhlRNtMutMPHuk"
  },
  installComponents: true
});

const routes = [
  { path: "/", component: Home },
  { path: "/course/:id", component: CourseWithControls },
  { path: "/auth", component: AuthComponent },
  { path: "/import", component: ImportCourses, meta: { requiresAuth: true } },
  { path: "/new", component: NewCourse, meta: { requiresAuth: true } },
  { path: "/mycourses", component: MyCourses, meta: { requiresAuth: true } }
];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      await Auth.currentAuthenticatedUser();
      next();
    } catch (error) {
      next({
        path: "/auth"
      });
    }
  } else {
    next();
  }
});

new Vue({
  router,
  vuetify: new Vuetify(opts),
  render: (h) => h(App)
}).$mount("#app");
