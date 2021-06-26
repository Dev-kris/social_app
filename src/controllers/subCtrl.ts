import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'class-validator';
import { getRepository } from 'typeorm';

import Sub from '../entities/Sub';
import Post from '../entities/Posts';
import User from '../entities/User';

// create a new sub community
exports.createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = 'Name must not be empty';
    if (isEmpty(title)) errors.title = 'Title must not be empty';

    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    //check if sub exists, if true, throw error
    if (sub) errors.name = 'Sub already exists';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  try {
    const sub = new Sub({ name, description, title, user });
    await sub.save();

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
exports.getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      // consider changing to popularity/voteCount for controversial
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    });

    sub.posts = posts;

    if (res.locals.user) {
      //check if user has already voted on a post
      sub.posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ sub: 'Sub not found. ' });
  }
};
// check if user created the sub, allows image modification
exports.ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });
    if (sub.username !== user.username) {
      return res.status(403).json({ error: 'You dont own this sub' });
    }
    res.locals.sub = sub;
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

//returns communities in search bar, searches for partial matches (at name start)
exports.searchSubs = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (isEmpty(name)) {
      return res.status(400).json({ error: 'Name must not be empty' });
    }

    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `${name.toLocaleLowerCase().trim()}%`,
      })
      .getMany();

    return res.json(subs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
