<template>
  <div class="app">
    <div class="app-title">
      <h1 v-on:click="goto('/')">QualityDashboard</h1>
    </div>
    <div class="app-actions">
      <h2>
        <font-awesome-icon class="menu-icon" icon="tachometer-alt" v-on:click="goto('/')" />
        <font-awesome-icon class="menu-icon" icon="user" v-on:click="goto('/login')" />
      </h2>
    </div>
    <div class="app-content">
      <AlertMessages />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import AlertMessages from "./components/AlertMessages.vue";
import { EventService } from "./services/EventService";
import { Timeout } from "./services/Timeout";
import UserService from "./services/UserService";

@Component({
  components: { AlertMessages },
})
export default class Reports extends Vue {
  //
  private isAuthenticated = false;

  private isInitialized = true;

  private created(): void {
    EventService.$on("user-initialized", (isInitialized: boolean) => {
      this.isInitialized = isInitialized;
      if (!isInitialized) {
        this.goto("/login");
      }
    });
    EventService.$on("user-authenticated", (isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.checkInitialization();
    this.checkAuthentication();
  }

  private async checkAuthentication(): Promise<void> {
    await UserService.checkAuthentication().catch((err: Error) => {
      EventService.$emit("alert-message", {
        text: `ERR: Connection to server failed (${err.message})`,
        type: "error",
      });
    });
    await Timeout.wait(30000);
    this.checkAuthentication();
  }

  private async checkInitialization() {
    UserService.checkInitialization().catch((err: Error) => {
      EventService.$emit("alert-message", `ERR: Connection to server failed (${err.message})`);
    });
  }

  private async goto(path: string) {
    this.$router.push(path);
  }
}
</script>

<style lang="scss">
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
