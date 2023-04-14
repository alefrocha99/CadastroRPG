import express from 'express';
import { usersRouter } from './routes/users';


const app = express();
app.use(express.json());
app.use(usersRouter);


app.listen(80, () => console.log('Server running on port 80'));

