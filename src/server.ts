import 'reflect-metadata';
import { createConnection } from 'typeorm'; //creates connection to db
import express from 'express';
import morgan from 'morgan'; //http request logger for node
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';

import trim from './middleware/trim';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.get('/', (_, res) => res.send('Hello World'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.listen(PORT, async () => {
  console.log('server running at localhost: ' + PORT);

  try {
    await createConnection();
    console.log('mySQL db Connected');
  } catch (err) {
    console.log(err);
  }
});
