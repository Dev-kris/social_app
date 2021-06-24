import { Request, Response, Router } from 'express';
import { getConnection } from 'typeorm';
import Post from '../entities/Posts';
import Sub from '../entities/Sub';

import auth from '../middleware/auth'; //make sure to correctly import auth
import user from '../middleware/user';

const voteController = require('../controllers/voteCtrl');

const topSubs = async (_: Request, res: Response) => {
  try {
    //TO DO: Test further and add ENV
    const imageUrlExp = `COALESCE( CONCAT('${process.env.APP_URL}/images/',s.imageUrn) , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y')`;
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as imageUrl, count(p.id) as postCount`
      )
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p.subName`)
      .groupBy('s.title, s.name, imageUrl')
      .orderBy(`postCount`, 'DESC')
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

const router = Router();
router.post('/vote', user, auth, voteController.vote);
router.get('/top-subs', topSubs);

export default router;
