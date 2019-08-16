<template>
  <div class="container">
    <nav>
      <h1>QualityDashboard</h1>
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

<script>
export default {
  components: {},
  data() {
    return {
      groups: []
    }
  },
  created() {
    this.$axios.$get('/api/reports').then((response) => {
      this.$data.groups = response.groups
    })
  }
}
</script>

<style>
.container {
  padding: 1em;
}
</style>
