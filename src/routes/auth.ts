import { Request, Response, Router } from 'express';
import { isEmpty, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import User from '../entities/User';
import auth from '../middleware/auth';
import user from '../middleware/user';

const authController = require('../controllers/authCtrl');

const router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', user, auth, authController.me); // for postman testing to display credentials
router.get('/logout', user, auth, authController.logout);

export default router;
