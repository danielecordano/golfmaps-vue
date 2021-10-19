import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueRouter from "vue-router";
import CourseWithControls from "./components/CourseWithControls";
import AuthComponent from "./components/AuthComponent";
import ImportCourses from "./components/ImportCourses";
import * as GmapVue from "gmap-vue";
import "@aws-amplify/ui-vue";
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

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
  { path: "/", component: CourseWithControls },
  { path: "/auth", component: AuthComponent },
  { path: "/import", component: ImportCourses }
];

const router = new VueRouter({
  routes
});
new Vue({
  router,
  vuetify: new Vuetify(opts),
  render: (h) => h(App)
}).$mount("#app");
