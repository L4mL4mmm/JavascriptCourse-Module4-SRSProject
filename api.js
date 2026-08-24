import express from 'express';
const router = express.Router();

import categoryRouter from './controllers/category.controller.js'
import productRouter from './controllers/product.controller.js'
import authRouter from './controllers/auth.controller.js'
import projectRouter from './controllers/project.controller.js'
import taskRouter from './controllers/task.controller.js'
import statRouter from './controllers/stat.controller.js'

router.use("/categories", categoryRouter);
router.use("/products", productRouter)

router.use("/v1/auth", authRouter);
router.use("/v1/projects", projectRouter);
router.use("/v1", taskRouter);
router.use("/v1", statRouter);

export default router


