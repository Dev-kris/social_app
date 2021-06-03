import 'reflect-metadata';
import { createConnection } from 'typeorm'; //creates connection to db
import express from 'express';
import morgan from 'morgan'; //http request logger for node
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth';
import trim from './middleware/trim';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.get('/', (_, res) => res.send('Hello World'));
app.use('/api/auth', authRoutes);
app.listen(5000, async () => {
  console.log('server running at localhost:5000');

  try {
    await createConnection();
    console.log('mySQL db Connected');
  } catch (err) {
    console.log(err);
  }
});
