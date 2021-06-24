import { Request, Response, Router } from 'express';
import { getConnection } from 'typeorm';
import Post from '../entities/Posts';
import Sub from '../entities/Sub';

import auth from '../middleware/auth'; //make sure to correctly import auth
import user from '../middleware/user';

const voteController = require('../controllers/voteCtrl');
const topSubsController = require('../controllers/topSubsCtrl');

const router = Router();
router.post('/vote', user, auth, voteController.vote);
router.get('/top-subs', topSubsController.topSubs);

export default router;
