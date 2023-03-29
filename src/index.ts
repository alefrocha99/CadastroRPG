import express from 'express';
import { usersRouter } from './routes/users';


const app = express();
app.use(express.json());
app.use(usersRouter);


app.listen(3000, () => console.log('Server running on port 3000'));

