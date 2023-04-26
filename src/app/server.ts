import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { usersRouter } from '../routes/users copy';
import { personsRouter } from '../routes/persons';
import { usersPassword } from '../routes/password'

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
app.use('/:id/persons', personsRouter);
app.use('/clear', usersRouter);
app.use('/users/:id/persons', personsRouter);
app.use('/userAuthentication/', usersRouter);
app.use('/resetPassword',usersPassword);
app.use('/users2', usersRouter);



export { app, port };