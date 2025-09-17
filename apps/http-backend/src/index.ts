import express from 'express';
import {PORT} from "@repo/backend-common/config";

const app = express();

app.use(express.json());

app.use('/api/v1/user');

app.listen(PORT)
console.log(`Listening on port http://localhost:${PORT}`)
