import { NextFunction, Request, Response } from 'express';

// middleware that removes blank spaces from inputs
// fields can be excluded in exceptions (passwords, sentences)

export default (req: Request, _: Response, next: NextFunction) => {
  const exceptions = ['password']; //allows passwords with spaces
  Object.keys(req.body).forEach((key) => {
    if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  });
  next();
};
