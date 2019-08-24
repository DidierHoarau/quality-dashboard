import * as fileUpload from 'express-fileupload';
import { ExpressWrapper } from '../utils-std-ts/express-wrapper';
import { ReportsRoute } from './ReportsRoute';
import { UsersRoute } from './UsersRoute';

export let router = ExpressWrapper.createRouter();

router.use(fileUpload());
router.use('/api/reports', ReportsRoute);
router.use('/api/users', UsersRoute);
