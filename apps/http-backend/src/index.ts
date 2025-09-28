import express from 'express';
import {PORT} from "@repo/backend-common/config";
import userRouter from './routes/user';

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/')

app.listen(PORT)
console.log(`Listening on port http://localhost:${PORT}`)
