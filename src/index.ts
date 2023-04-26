import express from 'express';
import { usersRouter } from './routes/users copy';
import { personsRouter } from './routes/persons';
import { usersPassword } from './routes/password';

const app = express();
app.use(express.json());
app.use(usersRouter);
app.use(personsRouter);
app.use(usersPassword);

app.listen(80, () => console.log('Server running on port 80'));

