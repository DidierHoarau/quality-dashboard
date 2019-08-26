import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle,
  faBomb,
  faExclamationTriangle,
  faPercentage,
  faTrashAlt,
  faSync,
  faCog,
  faUser,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheckCircle);
library.add(faBomb);
library.add(faExclamationTriangle);
library.add(faPercentage);
library.add(faTrashAlt);
library.add(faSync);
library.add(faCog);
library.add(faCog);
library.add(faUser);
library.add(faTachometerAlt);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
