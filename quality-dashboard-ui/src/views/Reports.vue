<template>
  <div class="report-list">
    <h1>QualityDashboard: Reports</h1>
    <div class="report-group" v-for="group in groups" :key="group.name">
      <div>
        <h2>{{ group.name }}</h2>
        <div class="report-project" v-for="project in group.projects" :key="project.name">
          <h3>{{ project.name }}</h3>
          <div class="report-version" v-for="version in project.versions" :key="version.name">
            <h4>{{ version.name }}</h4>
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

  private created(): void {
    axios
      .get("api/reports")
      .then((response: any) => {
        this.groups = response.data.groups;
      })
      .catch((err: Error) => {
        // Nothing
      });
  }
}
</script>
<style lang="scss">
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
</style>
