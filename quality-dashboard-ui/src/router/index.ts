import { createRouter, createWebHistory } from "vue-router";
import Settings from "@/views/Settings.vue";
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
      path: "/settings",
      name: "settings",
      component: Settings,
    },
  ],
});

export default router;
