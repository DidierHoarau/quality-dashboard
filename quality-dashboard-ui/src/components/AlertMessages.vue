<template>
  <div>
    <div v-for="message in messages" :key="message.date.getTime()">
      <div :class="'message message-' + message.type">{{ message.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import AlertService from "@/services/AlertService";

export default {
  data() {
    return {
      messages: [],
    };
  },

  // `mounted` is a lifecycle hook which we will explain later
  mounted() {
    AlertService.onEvent((event) => {
      this.messages.push({
        text: event.text,
        type: event.type,
        date: new Date(),
      });
      setTimeout(() => {
        this.messages.splice(0, 1);
      }, 5000);
    });
  },
};
</script>
<style>
.message {
  padding: 1rem;
  margin: 1rem;
  background-color: #fff9c4;
}
.message-info {
  background-color: #c7e5c8;
}
.message-error {
  background-color: #fff9c4;
}
</style>
