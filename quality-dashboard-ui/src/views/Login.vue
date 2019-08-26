<template>
  <div>
    <div v-if="isAuthenticated">
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
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { EventService } from "../services/EventService";
import UserService from "../services/UserService";

@Component({
  components: {}
})
export default class Login extends Vue {
  //
  private isAuthenticated = false;

  private isInitialized = true;

  private account = { password: "", username: "" };

  private created(): void {
    EventService.$on("user-authenticated", (isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
    EventService.$on("user-initialized", (isInitialized: boolean) => {
      if (!isInitialized) {
        this.isInitialized = false;
      } else {
        this.isInitialized = true;
      }
    });

    this.checkInitialization();
    this.checkAuthentication();
  }

  private async login() {
    if (!this.account.username || !this.account.password) {
      EventService.$emit("alert-message", "Username/Password missing");
    } else {
      try {
        await UserService.login(this.account.username, this.account.password);
        this.account.username = "";
        this.account.password = "";
      } catch (err) {
        EventService.$emit("alert-message", "Login failed");
      }
    }
  }

  private async createAdmin() {
    if (!this.account.username || !this.account.password) {
      EventService.$emit("alert-message", "Username/Password missing");
    } else {
      await UserService.addUser(
        this.account.username,
        this.account.password
      ).catch((err: Error) => {
        EventService.$emit(
          "alert-message",
          `ERR: Can not created account (${err.message})`
        );
      });
      this.account.username = "";
      this.account.password = "";
      await UserService.checkInitialization();
    }
  }

  private async changePassword() {
    if (!this.account.password) {
      EventService.$emit("alert-message", "Password missing");
    } else {
      await UserService.updatePassword(this.account.password).catch(
        (err: Error) => {
          EventService.$emit(
            "alert-message",
            `ERR: Can not update account (${err.message})`
          );
        }
      );
      this.account.username = "";
      this.account.password = "";
    }
  }

  private async logout() {
    await UserService.logout();
  }

  private async checkAuthentication(): Promise<void> {
    await UserService.checkAuthentication().catch((err: Error) => {
      EventService.$emit("alert-message", {
        text: `ERR: Connection to server failed (${err.message})`,
        type: "error"
      });
    });
  }

  private async checkInitialization() {
    UserService.checkInitialization().catch((err: Error) => {
      EventService.$emit(
        "alert-message",
        `ERR: Connection to server failed (${err.message})`
      );
    });
  }
}
</script>
<style lang="scss">
</style>
