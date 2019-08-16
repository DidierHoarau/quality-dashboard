import { AppApi } from './AppApi';
import { ReportsDB } from './ReportsDB';

ReportsDB.init().then(() => {
  AppApi.start();
});
