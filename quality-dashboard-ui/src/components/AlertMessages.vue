<template>
  <div>
    <div v-for="message in messages" :key="message.date.getTime()">
      <div :class="'message message-' + message.type">{{ message.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { EventService } from "../services/EventService";

@Component
export default class AlertMessages extends Vue {
  private messages: any[] = [];

  private async created(): Promise<void> {
    EventService.$on("alert-message", (message: string) => {
      this.messages.push({
        text: message,
        date: new Date()
      });
      setTimeout(() => {
        this.messages.splice(0, 1);
      }, 5000);
    });
  }
}
</script>
<style lang="scss">
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
