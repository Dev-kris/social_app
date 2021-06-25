import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import Post from '../entities/Posts';
import Sub from '../entities/Sub';

exports.topPosts = async (_: Request, res: Response) => {
  try {
    //returns stored image from server or a placeholder image.
    const subs = await getConnection()
      .createQueryBuilder()
      // retrieves sub data and images, sorted by post count
      .select(`s.title, s.name, count(p.id) as postCount`)
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p.subName`)
      .groupBy('s.title, s.name, imageUrl')
      .orderBy(`voteScore`, 'DESC')
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
