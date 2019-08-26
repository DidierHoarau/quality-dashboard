<template>
  <div class="report-list">
    <h2>Reports</h2>
    <font-awesome-icon class="action-icon" icon="sync" v-on:click="getGroups()" />
    <div class="report-group" v-for="group in groups" :key="group.name">
      <h3>{{ group.name }}</h3>
      <div class="report-project" v-for="project in group.projects" :key="project.name">
        <h4>{{ project.name }}</h4>
        <div class="report-version" v-for="version in project.versions" :key="version.name">
          <div>
            <h5>{{ version.name }}</h5>
            <font-awesome-icon
              class="action-icon"
              icon="trash-alt"
              v-on:click="deleteVersion(group.name, project.name, version.name)"
              v-if="isAuthenticated"
            />
          </div>
          <div class="report-report" v-for="report in version.reports" :key="report.name">
            <a
              :href="'./api/reports_data/'+group.name+'/'+project.name+'/'+version.name+'/'+report.name+'/report/'+report.result.link"
            >{{ report.name }}</a>
            <span class="report-metric">{{ new Date(report.date).toLocaleString() }}</span>
            <span
              v-if="report.result.total"
              class="report-metric"
            >(Total: {{ report.result.total }})</span>
            <span v-if="report.result.success" class="report-metric quality-success">
              <font-awesome-icon icon="check-circle" />
              x{{ report.result.success }}
            </span>
            <span v-if="report.result.warning" class="report-metric quality-warning">
              <font-awesome-icon icon="exclamation-triangle" />
              x{{ report.result.warning }}
            </span>
            <span v-if="report.result.error" class="report-metric quality-error">
              <font-awesome-icon icon="bomb" />
              x{{ report.result.error }}
            </span>
            <span v-if="report.result.coverage" class="report-metric">
              {{ report.result.coverage.replace('%','') }}
              <font-awesome-icon icon="percentage" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { EventService } from "../services/EventService";
import AlertMessages from "../components/AlertMessages.vue";
import UserService from "../services/UserService";
import ReportService from "../services/ReportService";

@Component({
  components: {}
})
export default class Reports extends Vue {
  //
  private groups: any[] = [];

  private isAuthenticated = false;

  private created(): void {
    EventService.$on("user-authenticated", (isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.checkAuthentication();

    this.getGroups();
  }

  private async getGroups() {
    try {
      const response = await ReportService.getGroups();
      this.groups = response.data.groups;
    } catch (err) {
      EventService.$emit(
        "alert-message",
        `ERR: Error getting reports: ${err.message}`
      );
    }
  }

  private async deleteVersion(group: string, project: string, version: string) {
    if (confirm(`Delete version ${version}?`)) {
      try {
        await ReportService.deleteVersion(group, project, version);
        this.getGroups();
      } catch (err) {
        EventService.$emit(
          "alert-message",
          `ERR: Error deleting version (${err.message})`
        );
      }
    }
  }

  private async checkAuthentication(): Promise<void> {
    await UserService.checkAuthentication().catch((err: Error) => {
      EventService.$emit("alert-message", {
        text: `ERR: Connection to server failed (${err.message})`,
        type: "error"
      });
    });
  }
}
</script>
<style lang="scss">
.report-project,
.report-version,
.report-report {
  padding-left: 2vw;
}
.report-version {
  border-top: 2px solid;
}
.report-metric {
  float: right;
  padding-right: 2em;
  font-size: 90%;
}
.quality-success {
  color: #43a047;
}
.quality-warning {
  color: #ffb300;
}
.quality-error {
  color: #e53935;
}
.action-icon {
  float: right;
  margin-top: -3em;
}
</style>
