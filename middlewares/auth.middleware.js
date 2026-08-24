import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { sendResponse } from '../utils/response.js';

/**
 * Middleware to verify Bearer JWT token.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, "Quyền truy cập bị từ chối. Token không tồn tại.");
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_hedspi_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, "Token không hợp lệ hoặc đã hết hạn.");
  }
};

/**
 * Middleware to check if the authenticated user is the project owner.
 * Works for both project routes (/api/v1/projects/:id) and task routes (/api/v1/tasks/:id).
 */
export const isProjectOwner = async (req, res, next) => {
  try {
    let projectId = null;

    // Check project ID in params
    if (req.params.id && req.originalUrl.includes('projects')) {
      projectId = parseInt(req.params.id);
    } else if (req.params.projectId) {
      projectId = parseInt(req.params.projectId);
    } else if (req.body.project_id) {
      projectId = parseInt(req.body.project_id);
    } else if (req.params.id && req.originalUrl.includes('tasks')) {
      // If it's a task route (/api/v1/tasks/:id), lookup the task's project ID
      const taskId = parseInt(req.params.id);
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { project_id: true }
      });
      if (!task) {
        return sendResponse(res, 404, false, "Không tìm thấy công việc");
      }
      projectId = task.project_id;
    }

    if (!projectId) {
      return sendResponse(res, 400, false, "Không tìm thấy mã dự án để xác thực quyền sở hữu");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { owner_id: true }
    });

    if (!project) {
      return sendResponse(res, 404, false, "Không tìm thấy dự án");
    }

    if (project.owner_id !== req.user.id) {
      return sendResponse(res, 403, false, "Chỉ chủ sở hữu dự án mới có quyền thực hiện thao tác này");
    }

    // Attach project_id to request
    req.projectId = projectId;
    next();
  } catch (error) {
    next(error);
  }
};
