import { Request, Response, Router, NextFunction, response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

import Sub from '../entities/Sub';
import { makeId } from '../util/helpers';

//formats uploaded files in public/images
//uses makeId helper to create unique filename
exports.upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    //only accept jpegs and pngs
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('Not an image'));
    }
  },
});

exports.uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    //if unexpected file type is uploaded, remove
    if (type !== 'image' && type !== 'banner') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid Type' });
    }
    let oldImageUrn: string = '';

    //if image is uploaded successfully set appropriate urn.
    if (type === 'image') {
      oldImageUrn = sub.imageUrn || '';
      sub.imageUrn = req.file.filename;
    } else if (type === 'banner') {
      oldImageUrn = sub.bannerUrn || '';
      sub.bannerUrn = req.file.filename;
    }
    await sub.save();
    // if upload replaces old image, remove old image
    if (oldImageUrn !== '') {
      fs.unlinkSync(`public/images/${oldImageUrn}`);
    }

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
  return res.json({ success: true });
};
