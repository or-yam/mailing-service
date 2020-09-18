import {app as getApp} from '@greenpress/api-kit'
import authCheck from '../middleware/auth-check'
import editorCheck from '../middleware/editor-check'
import providersRoutes from './providers'

const app = getApp();
app.use(authCheck, editorCheck);
providersRoutes(app);
