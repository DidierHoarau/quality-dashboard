<template>
  <div>
    <div v-if="isAuthenticated">
      <h2>Logged In</h2>
      <button v-on:click="logout()">Logout</button>
      <br />
      <br />
      <h2>Change Password</h2>
      <div class="form">
        <div class="form-label">Password:</div>
        <div class="form-field">
          <input type="password" v-model="account.password" />
        </div>
        <button v-on:click="changePassword()">Save</button>
        <br />
        <br />
        <h2>Settting</h2>
        <div class="form-label">Make Dashboard Public</div>
        <div class="form-field">
          <input type="password" v-model="config.isDashboardPublic" />
        </div>
        <div class="form-label">Upload Token</div>
        <div class="form-field">
          <input type="password" v-model="config.uploadToken" />
        </div>
        <button v-on:click="saveSettings()">Save</button>
      </div>
    </div>
    <div v-else>
      <h2 v-if="isInitialized">Login</h2>
      <h2 v-else>Create Admin Account</h2>
      <div class="form">
        <div class="form-label">Username:</div>
        <div class="form-field">
          <input type="username" v-model="account.username" />
        </div>
        <div class="form-label">Password:</div>
        <div class="form-field">
          <input type="password" v-model="account.password" />
        </div>
      </div>
      <button v-if="isInitialized" v-on:click="login()">Login</button>
      <button v-else v-on:click="createAdmin()">Create</button>
    </div>
  </div>
</template>

<script lang="ts">
import UserService from "@/services/UserService";
import mitt from "mitt";
import type EventAlert from "@types/EventAlert";
import { appConfigStore } from "@/stores/appConfig";
import { userAuthenticationStore } from "@/stores/userAuthentication";

const emitter = mitt<EventAlert>();

export default {
  data() {
    return {
      isAuthenticated: false,
      isInitialized: true,
      account: { password: "", username: "" },
      config: { isDashboardPublic: "", uploadToken: "" },
    };
  },

  mounted() {
    const appConfig = appConfigStore();
    appConfig.$subscribe((mutation, state) => {
      this.isInitialized = state.isAuthInitialized;
    });
    const userAuthentication = userAuthenticationStore();
    userAuthentication.$subscribe((mutation, state) => {
      this.isAuthenticated = state.isAuthenticated;
    });
  },
  methods: {
    async login() {
      if (!this.account.username || !this.account.password) {
        emitter.emit("alertMessage", {
          text: "Username/Password missing",
          type: "error",
        });
      } else {
        try {
          await UserService.login(this.account.username, this.account.password);
          this.account.username = "";
          this.account.password = "";
        } catch (err) {
          emitter.emit("alertMessage", {
            text: "Login Failed",
            type: "error",
          });
        }
      }
    },

    async createAdmin() {
      if (!this.account.username || !this.account.password) {
        EventService.$emit("alert-message", "Username/Password missing");
      } else {
        await UserService.addUser(this.account.username, this.account.password).catch((err: Error) => {
          EventService.$emit("alert-message", `ERR: Can not created account (${err.message})`);
        });
        this.account.username = "";
        this.account.password = "";
        await UserService.checkInitialization();
      }
    },

    async changePassword() {
      if (!this.account.password) {
        EventService.$emit("alert-message", "Password missing");
      } else {
        await UserService.updatePassword(this.account.password).catch((err: Error) => {
          EventService.$emit("alert-message", `ERR: Can not update account (${err.message})`);
        });
        this.account.username = "";
        this.account.password = "";
      }
    },

    async logout() {
      await UserService.logout();
    },

    async checkAuthentication(): Promise<void> {
      await UserService.checkAuthentication().catch((err: Error) => {
        EventService.$emit("alert-message", {
          text: `ERR: Connection to server failed (${err.message})`,
          type: "error",
        });
      });
    },

    async checkInitialization() {
      UserService.checkInitialization().catch((err: Error) => {
        EventService.$emit("alert-message", `ERR: Connection to server failed (${err.message})`);
      });
    },
  },
};
</script>
<style lang="scss"></style>
