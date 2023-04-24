import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { usersRouter } from '../routes/users';

const corsOptions = {
  origin: 'http://127.0.0.1:5500'
}

const app = express();
const port = 80;

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/users', usersRouter);
app.use('/:id/persons', usersRouter);
app.use('/clear', usersRouter);
app.use('/users/:id/persons', usersRouter);
app.use('/userAuthentication/', usersRouter);
app.use('/resetPassword',usersRouter);
app.use('/users2', usersRouter);



export { app, port };