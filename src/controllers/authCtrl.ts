import { Request, Response, Router } from 'express';
import { isEmpty, validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import User from '../entities/User';
import auth from '../middleware/auth';
import user from '../middleware/user';

const mapErrors = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

exports.register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //Validate Data
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser) errors.email = 'Email address is already taken ';
    if (usernameUser) errors.username = 'Username is already taken ';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //Create User
    const user = new User({ email, username, password });

    errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json(mapErrors(errors));
    }

    await user.save();

    //Return User
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = 'Please enter a username';
    if (isEmpty(password)) errors.password = 'Please enter a password';
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ username: 'User not found' });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ password: 'Password is incorrect' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET!); //key is in src/.env
    res.set(
      'set-cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // enable https if node_env is set to production
        sameSite: 'strict',
        maxAge: 28800, //cookie expires in 8 hours, change in production
        path: '/',
      })
    );
    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.json({ error: 'Something went wrong.' });
  }
};

exports.me = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

exports.logout = (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), //8hours
      path: '/',
    })
  );
  return res.status(200).json({ success: true });
};
