import express from 'express';
import { StatModel } from '../models/stat.model.js';
import { ProjectModel } from '../models/project.model.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { sendResponse } from '../utils/response.js';

const router = express.Router();

// Apply verifyToken to all routes in this controller
router.use(verifyToken);

/**
 * GET /api/v1/projects/:id/statistics
 * Get project statistics (accessible by Project Owner and members).
 */
router.get('/projects/:id/statistics', async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return sendResponse(res, 404, false, "Không tìm thấy dự án");
    }

    // Verify access
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

/**
 * GET /api/v1/users/me/statistics
 * Get personal task assignment statistics.
 */
router.get('/users/me/statistics', async (req, res, next) => {
  try {
    const stats = await StatModel.getUserStats(req.user.id);
    return sendResponse(res, 200, true, "Lấy thống kê cá nhân thành công", stats);
  } catch (error) {
    next(error);
  }
});

export default router;
