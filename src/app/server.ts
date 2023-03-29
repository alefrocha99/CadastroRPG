import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { usersRouter } from '../routes/users';


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/users', usersRouter);
app.use('/:id/persons', usersRouter);
app.use('/clear', usersRouter);
app.use('/users/:id/persons', usersRouter);





export { app, port };