<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
import UserService from "./services/UserService";
import EventService from "./services/EventService";
import Timeout from "./services/Timeout";
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script lang="ts">
export default {
  data() {
    return {
      count: 1,
    };
  },

  // `mounted` is a lifecycle hook which we will explain later
  mounted() {
    // `this` refers to the component instance.
    console.log(this.count); // => 1

    // data can be mutated as well
    this.count = 2;
  },
  methods: {
    async checkAuthentication() {
      await UserService.checkAuthentication().catch((err: Error) => {
        EventService.$emit("alert-message", {
          text: `ERR: Connection to server failed (${err.message})`,
          type: "error",
        });
      });
      await Timeout.wait(30000);
      this.checkAuthentication();
    },
    async checkInitialization() {
      UserService.checkInitialization().catch((err: Error) => {
        EventService.$emit("alert-message", `ERR: Connection to server failed (${err.message})`);
      });
    },
    async goto(path: string) {
      this.$router.push(path);
    },
  },
};
</script>

<style>
@import "@/assets/base.css";

body {
  padding: 0;
  margin: 0;
  background-color: #f0f0f0;
}

h1 {
  font-size: 180%;
}
h2 {
  font-size: 160%;
}
h3 {
  font-size: 140%;
}
h4 {
  font-size: 120%;
}

.app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  grid-template-rows: 5em 1fr;
  grid-template-columns: 1fr 1fr;
  padding: 0;
  margin: 0;
}

.app-title {
  grid-row: 1;
  grid-column: 1;
  padding-left: 5vw;
  background-color: #3949ab;
  color: #eee;
}

.app-actions {
  grid-row: 1;
  grid-column: 2;
  text-align: right;
  padding-right: 5vw;
  padding-top: 0.2em;
  background-color: #3949ab;
  color: #eee;
}

.app-content {
  grid-row: 2;
  grid-column-start: 1;
  grid-column-end: 2 span;
  padding: 1em 5vw;
}

button {
  background-color: #039be5; /* Green */
  border: none;
  color: white;
  padding: 0.4em 0.8em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1em;
  margin-top: 0.4em;
  margin-bottom: 0.4em;
}

input {
  background-color: #fff; /* Green */
  border: solid 1px #666;
  padding: 0.4em 0.6em;
  font-size: 1em;
}

.menu-icon {
  margin-left: 0.6em;
}

.alert-message {
  background-color: #fff59d;
  padding: 2em;
}
</style>
