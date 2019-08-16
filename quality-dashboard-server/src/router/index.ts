import * as fileUpload from 'express-fileupload';
import { ReportsRoute } from './ReportsRoute';
import { ExpressWrapper } from '../utils-std-ts/express-wrapper';

export let router = ExpressWrapper.createRouter();

router.use(fileUpload());
router.use('/api/reports', ReportsRoute);
