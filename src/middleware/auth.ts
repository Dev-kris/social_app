import { NextFunction, Request, Response } from 'express';
import User from '../entities/User';

//saves auth status to res.locals
//used for retreiving user information without authentication
export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;

    if (!user) throw new Error('Not Authenticated');
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Not Authenticated' });
  }
};
