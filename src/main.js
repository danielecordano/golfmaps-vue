import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueRouter from "vue-router";
import CourseWithControls from "./components/CourseWithControls";
import * as GmapVue from "gmap-vue";

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

const routes = [{ path: "/", component: CourseWithControls }];

const router = new VueRouter({
  routes // short for `routes: routes`
});
new Vue({
  router,
  vuetify: new Vuetify(opts),
  render: (h) => h(App)
}).$mount("#app");
