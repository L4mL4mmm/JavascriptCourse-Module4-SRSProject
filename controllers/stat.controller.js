import express from 'express';
import { StatModel } from '../models/stat.model.js';
import { ProjectModel } from '../models/project.model.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { sendResponse } from '../utils/response.js';

const router = express.Router();

// kiem tra token cho tat ca cac api trong file nay
router.use(verifyToken);

// api lay thong ke cua du an
router.get('/projects/:id/statistics', async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return sendResponse(res, 404, false, "Không tìm thấy dự án");
    }

    // kiem tra quyen xem thong ke du an
    const isOwner = project.owner_id === req.user.id;
    const isMember = project.members.some(member => member.user_id === req.user.id);

    if (!isOwner && !isMember) {
      return sendResponse(res, 403, false, "Bạn không có quyền xem thống kê của dự án này");
    }

    const stats = await StatModel.getProjectStats(projectId);
    return sendResponse(res, 200, true, "Lấy thống kê dự án thành công", stats);
  } catch (error) {
    next(error);
  }
});

// api lay thong ke cong viec cua ca nhan hien tai
router.get('/users/me/statistics', async (req, res, next) => {
  try {
    const stats = await StatModel.getUserStats(req.user.id);
    return sendResponse(res, 200, true, "Lấy thống kê cá nhân thành công", stats);
  } catch (error) {
    next(error);
  }
});

export default router;

