import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Reports from "./views/Reports.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "reports",
      component: Reports,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});
