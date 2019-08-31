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
          <div class="report-reports">
            <div class="report-report" v-for="report in version.reports" :key="report.name">
              <div class="report-title">
                <a
                  :href="'./api/reports_data/'+group.name+'/'+project.name+'/'+version.name+'/'+report.name+'/report/'+report.result.link"
                >{{ report.name }}</a>
              </div>
              <div class="report-metrics">
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
                <span
                  v-if="report.result.total"
                  class="report-metric"
                >All x{{ report.result.total }}</span>
              </div>
              <div class="report-date">{{ dateToRelative(new Date(report.date)) }}</div>
            </div>
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

  private dateToRelative(date: Date): string {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = new Date().getTime() - date.getTime();

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " sec. ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " min. ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " h. ago";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
      return Math.round(elapsed / msPerYear) + " years ago";
    }
  }
}
</script>
<style lang="scss">
.report-project,
.report-version,
.report-reports {
  padding-left: 2vw;
}
.report-version {
  border-top: 2px solid;
}
.report-reports {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2em;
}
.report-report {
  width: 10em;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  padding: 0.4em 0.8em;
  margin-bottom: 0.8em;
  margin-right: 0.8em;
  background-color: #cfd8dc;
}
.report-title {
  font-size: 90%;
  text-align: center;
  width: 100%;
  border-bottom: 2px dotted #888;
  padding-bottom: 0.2em;
  margin-bottom: 0.6em;
}
.report-title a:any-link {
  color: #0d47a1;
  word-wrap: break-word;
}
.report-metrics {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}
.report-metric {
  font-size: 90%;
  width: 30%;
}
.report-date {
  font-size: 70%;
  text-align: right;
  width: 100%;
  color: #888;
}
.quality-success {
  color: #43a047;
}
.quality-warning {
  color: #ff7043;
}
.quality-error {
  color: #e53935;
}
.action-icon {
  float: right;
  margin-top: -3em;
}
</style>
