import { Router } from 'express';

import auth from '../middleware/auth';
import user from '../middleware/user';

const postsController = require('../controllers/postsCtrl');

const router = Router();

router.post('/', user, auth, postsController.createPost);
router.get('/', user, postsController.getPosts);
router.get('/:identifier/:slug', user, postsController.getPost);
router.post(
  '/:identifier/:slug/comments',
  user,
  auth,
  postsController.commentOnPost
);
router.get(
  '/:identifier/:slug/comments',
  user,
  postsController.getPostComments
);

export default router;
