import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { sendResponse } from '../utils/response.js';

// middleware kiem tra token dang nhap jwt
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // kiem tra header authorization co hop le khong
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, "Quyền truy cập bị từ chối. Token không tồn tại.");
  }

  // tach lay chuoi token jwt
  const token = authHeader.split(' ')[1];

  try {
    // xac thuc token chuoi ky tu bi mat
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_hedspi_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, "Token không lệ hoặc đã hết hạn.");
  }
};

// middleware kiem tra quyen chu so huu du an
export const isProjectOwner = async (req, res, next) => {
  try {
    let projectId = null;

    // xac dinh project id tu request param hoac body
    if (req.params.id && req.originalUrl.includes('projects')) {
      projectId = parseInt(req.params.id);
    } else if (req.params.projectId) {
      projectId = parseInt(req.params.projectId);
    } else if (req.body.project_id) {
      projectId = parseInt(req.body.project_id);
    } else if (req.params.id && req.originalUrl.includes('tasks')) {
      // neu la router cua task, can tim project id cua task do
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

    // bao loi neu khong co project id
    if (!projectId) {
      return sendResponse(res, 400, false, "Không tìm thấy mã dự án để xác thực quyền sở hữu");
    }

    // lay thong tin chu so huu du an
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { owner_id: true }
    });

    if (!project) {
      return sendResponse(res, 404, false, "Không tìm thấy dự án");
    }

    // kiem tra nguoi dung hien tai co phai chu so huu khong
    if (project.owner_id !== req.user.id) {
      return sendResponse(res, 403, false, "Chỉ chủ sở hữu dự án mới có quyền thực hiện thao tác này");
    }

    // luu project id vao request de su dung tiep
    req.projectId = projectId;
    next();
  } catch (error) {
    next(error);
  }
};

