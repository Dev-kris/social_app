import { Request, Response, Router } from 'express';
import { validate } from 'class-validator';

import { User } from '../entities/User';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //TODO Validate Data
    //TODO Create User
    const user = new User({ email, username, password });
    const errors = await validate(user);
    if (errors.length > 0) return res.status(400).json({ errors });

    await user.save();

    //TODO Return User
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const router = Router();
router.post('/register', register);

export default router;
