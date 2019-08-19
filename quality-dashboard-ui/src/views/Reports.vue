<template>
  <div class="container">
    <nav>
      <h1>QualityDashboard: Reports</h1>
      <div v-for="group in groups" :key="group.name">
        <div>
          {{ group.name }}
          <div v-for="project in group.projects" :key="project.name">
            {{ project.name }}
            <div v-for="version in project.versions" :key="version.name">
              {{ version.name }}
              <div v-for="report in version.reports" :key="report.name">
                {{ report.name }}
                {{ report.date }}
                {{ report.result.success }}
                {{ report.result.warning }}
                {{ report.result.error }}
                {{ report.result.coverage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section></section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import axios from "axios";

@Component({
  components: {}
})
export default class Reports extends Vue {
  private groups: any[] = [];

  private created(): void {
    axios
      .get("/api/reports")
      .then((response: any) => {
        this.groups = response.groups;
      })
      .catch((err: Error) => {
        // Nothing
      });
  }
}
</script>
