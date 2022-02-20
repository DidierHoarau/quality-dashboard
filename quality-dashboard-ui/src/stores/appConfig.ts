import { defineStore } from "pinia";

export const appConfigStore = defineStore("appConfig", {
  state: () => {
    return {
      isAuthInitialized: false,
      isDashboardPublic: false,
      counter: 0,
    };
  },
});
