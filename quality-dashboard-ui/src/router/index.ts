import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Reports from "@/views/Reports.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

export default router;
