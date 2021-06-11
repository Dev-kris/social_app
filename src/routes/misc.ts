import { Request, Response, Router } from 'express';
import Comment from '../entities/Comment';
import Post from '../entities/Posts';
import User from '../entities/User';
import Vote from '../entities/vote';

import auth from '../middleware/auth'; //make sure to correctly import auth
import user from '../middleware/user';

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  //Vote Validation
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: 'Value must be -1, 0, or 1.' });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      //if there is a comment identifier, find vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // Else, find vote by post
      vote = await Vote.findOne({ user, post });
    }
    if (!vote && value === 0) {
      // if no vote and value = 0, return 0
      return res.status(404).json({ error: 'Vote not found' });
    } else if (!vote) {
      //if no vote is found, create it
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value === 0) {
      // if vote exists and = 0, remove vote from db
      await vote.remove();
    } else if (vote.value !== value) {
      //if vote and value has changed, update db
      vote.value = value;
      await vote.save();
    }
    // fetch post (by id and slug) with comments, comment votes, sub name, and post votes
    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const router = Router();
router.post('/vote', user, auth, vote);

export default router;
