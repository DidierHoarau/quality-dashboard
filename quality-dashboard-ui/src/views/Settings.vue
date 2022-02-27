<template>
  <div class="settings-page">
    <div v-if="isAuthenticated" class="settings-login">
      <h1>User</h1>
      <div class="form">
        <p>You are logged in</p>
        <button v-on:click="logout()">Logout</button>
      </div>
      <div class="form">
        <div class="form-label">Change Password:</div>
        <div class="form-field">
          <input type="password" v-model="account.password" />
        </div>
        <button v-on:click="changePassword()">Save</button>
      </div>
    </div>
    <div v-else class="settings-login">
      <h2 v-if="isInitialized">User</h2>
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
    <div v-if="isAuthenticated" class="settings-app">
      <h1>Settting</h1>
      <div class="form">
        <div class="form-field">
          <input type="checkbox" id="isDashboardPublic" v-model="config.isDashboardPublic" />&nbsp;&nbsp;Make Dashboard
          Public
        </div>
        <div class="form-label">Upload Token:</div>
        <div class="form-field">
          <input type="password" v-model="config.uploadToken" />
        </div>
        <br />
        <button v-on:click="saveSettings()">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import UserService from "@/services/UserService";
import AppConfigService from "@/services/AppConfigService";
import mitt from "mitt";
import type EventAlert from "@types/EventAlert";
import { appConfigStore } from "@/stores/appConfig";
import { userAuthenticationStore } from "@/stores/userAuthentication";

const emitter = mitt<EventAlert>();

export default {
  data() {
    return {
      isAuthenticated: false,
      uploadToken: "",
      isInitialized: true,
      account: { password: "", username: "" },
      config: { isDashboardPublic: "", uploadToken: "" },
    };
  },

  mounted() {
    const appConfig = appConfigStore();
    appConfig.$subscribe((mutation, state) => {
      console.log(state);
      this.config.isDashboardPublic = state.isDashboardPublic;
      this.config.uploadToken = state.uploadToken;
    });
    this.config.isDashboardPublic = appConfig.isDashboardPublic;
    this.config.uploadToken = appConfig.uploadToken;
    AppConfigService.get().catch((err: Error) => {
      // EventService.$emit("alert-message", `ERR: Can not get application config (${err.message})`);
    });

    const userAuthentication = userAuthenticationStore();
    userAuthentication.$subscribe((mutation, state) => {
      this.isAuthenticated = state.isAuthenticated;
    });
    this.isAuthenticated = userAuthentication.isAuthenticated;
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

    async saveSettings() {
      AppConfigService.update({
        isDashboardPublic: this.config.isDashboardPublic,
        uploadToken: this.config.uploadToken,
      }).catch((err: Error) => {
        // EventService.$emit("alert-message", `ERR: Can not get application config (${err.message})`);
      });
    },
  },
};
</script>
<style>
.settings-page {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.settings-page .form {
  margin-top: 2em;
}
.settings-page .form-label {
  margin-top: 0.8em;
}
</style>
