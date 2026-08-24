// khoi tao router
import express from 'express';
const router = express.Router();

// import cac router controller
import categoryRouter from './controllers/category.controller.js'
import productRouter from './controllers/product.controller.js'
import authRouter from './controllers/auth.controller.js'
import projectRouter from './controllers/project.controller.js'
import taskRouter from './controllers/task.controller.js'
import statRouter from './controllers/stat.controller.js'

// dinh tuyen danh muc va san pham cu
router.use("/categories", categoryRouter);
router.use("/products", productRouter)

// dinh tuyen cac api v1 moi
router.use("/v1/auth", authRouter);
router.use("/v1/projects", projectRouter);
router.use("/v1", taskRouter);
router.use("/v1", statRouter);

export default router



