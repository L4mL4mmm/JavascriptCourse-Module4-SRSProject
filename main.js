// nap bien moi truong tu env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import api from './api.js';
import { errorHandler } from './middlewares/error.middleware.js';

// khoi tao express va cong chay
const app = express();
const port = process.env.PORT || 3000;

// dung body parser de doc json
app.use(bodyParser.json());

// dinh tuyen api
app.use("/api", api);

// bat loi toan cuc
app.use(errorHandler);

// bat dau lang nghe cong
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

