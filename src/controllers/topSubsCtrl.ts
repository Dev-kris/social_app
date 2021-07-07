import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import Post from '../entities/Posts';
import Sub from '../entities/Sub';

exports.topSubs = async (_: Request, res: Response) => {
  try {
    //returns stored image from server or a placeholder image.
    const imageUrlExp = `COALESCE( CONCAT('${process.env.APP_URL}/images/',s.imageUrn) , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y')`;
    const subs = await getConnection()
      .createQueryBuilder()
      // retrieves sub data and images, sorted by post count
      .select(
        `s.title, s.name, ${imageUrlExp} as imageUrl, count(p.id) as postCount`
      )
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p.subName`)
      .groupBy('s.title, s.name, imageUrl')
      .orderBy(`postCount`, 'DESC')
      .limit(10)
      .execute();

    return res.json(subs);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
