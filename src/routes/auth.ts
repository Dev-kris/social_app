import { Router } from 'express';

import auth from '../middleware/auth';
import user from '../middleware/user';

const authController = require('../controllers/authCtrl');

const router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', user, auth, authController.me); // for postman testing to display credentials
router.get('/logout', user, auth, authController.logout);

export default router;
