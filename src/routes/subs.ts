import { Router } from 'express';

import auth from '../middleware/auth';
import user from '../middleware/user';

const multerConfig = require('../middleware/multer');
const subController = require('../controllers/subCtrl');

const router = Router();

router.post('/', user, auth, subController.createSub);
router.get('/:name', user, subController.getSub);
router.get('/search/:name', user, subController.searchSubs);
router.post(
  '/:name/image',
  user,
  auth,
  subController.ownSub,
  multerConfig.upload.single('file'),
  multerConfig.uploadSubImage
);

export default router;
