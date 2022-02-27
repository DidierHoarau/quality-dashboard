import { defineStore } from "pinia";

export const appConfigStore = defineStore("appConfig", {
  state: () => {
    return {
      isDashboardPublic: false,
      uploadToken: "",
    };
  },
});
