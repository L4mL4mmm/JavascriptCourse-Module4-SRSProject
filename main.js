import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import api from './api.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api", api);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
