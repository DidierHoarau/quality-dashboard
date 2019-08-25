<template>
  <div class="report-list">
    <h1>QualityDashboard: Reports</h1>
    <font-awesome-icon class="action-icon" icon="sync" v-on:click="getGroups()" />
    <div v-if="message.text" class="alert-message">{{ message.text }}</div>
    <div class="report-group" v-for="group in groups" :key="group.name">
      <h2>{{ group.name }}</h2>
      <div class="report-project" v-for="project in group.projects" :key="project.name">
        <h3>{{ project.name }}</h3>
        <div class="report-version" v-for="version in project.versions" :key="version.name">
          <div>
            <h4>{{ version.name }}</h4>
            <font-awesome-icon
              class="action-icon"
              icon="trash-alt"
              v-on:click="deleteVersion(group.name, project.name, version.name)"
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

@Component({
  components: {}
})
export default class Reports extends Vue {
  private groups: any[] = [];

  private message = { text: "" };

  private created(): void {
    this.getGroups();
  }

  private async getGroups() {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_BASEPATH}api/reports`
      );
      this.groups = response.data.groups;
      this.message.text = "";
    } catch (err) {
      this.message.text = `Error getting reports: ${err.message}`;
    }
  }

  private async deleteVersion(group: string, project: string, version: string) {
    if (confirm(`Delete version ${version}?`)) {
      try {
        const response = await axios.delete(
          `api/reports/${group}/${project}/${version}`
        );
        this.getGroups();
      } catch (err) {
        this.message.text = `Error deleting version: ${err.message}`;
      }
    }
  }
}
</script>
<style lang="scss">
.alert-message {
  background-color: #fff59d;
  padding: 2em;
}

.report-list {
  padding: 1em;
}
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
