import { Router } from 'express';

const userController = require('../controllers/userCtrl');

import user from '../middleware/user';
const router = Router();

router.get('/:username', user, userController.getUserSubmissions);

export default router;
