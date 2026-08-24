import express from 'express';
import { TaskModel } from '../models/task.model.js';
import { ProjectModel } from '../models/project.model.js';
import { verifyToken, isProjectOwner } from '../middlewares/auth.middleware.js';
import { sendResponse } from '../utils/response.js';

const router = express.Router();

// kiem tra token dang nhap cho toan bo api task
router.use(verifyToken);

// api tao cong viec moi (chi chu du an duoc lam)
router.post('/projects/:id/tasks', isProjectOwner, async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const { title, description, assignee_id, status, priority, due_date } = req.body;

    // kiem tra tieu de bat buoc
    if (!title) {
      return sendResponse(res, 400, false, "Tiêu đề công việc không được để trống");
    }

    // kiem tra nguoi duoc giao co phai thanh vien du an khong
    if (assignee_id) {
      const isMember = await ProjectModel.isMember(projectId, assignee_id);
      const project = await ProjectModel.findById(projectId);
      const isOwner = project.owner_id === parseInt(assignee_id);

      if (!isMember && !isOwner) {
        return sendResponse(res, 400, false, "Người được phân công phải là thành viên hoặc chủ sở hữu dự án");
      }
    }

    const task = await TaskModel.create({
      project_id: projectId,
      title,
      description,
      assignee_id,
      status,
      priority,
      due_date
    });

    return sendResponse(res, 201, true, "Tạo công việc thành công", task);
  } catch (error) {
    next(error);
  }
});

// api lay danh sach cong viec (cho ca owner va member)
router.get('/projects/:id/tasks', async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return sendResponse(res, 404, false, "Không tìm thấy dự án");
    }

    // kiem tra quyen xem
    const isOwner = project.owner_id === req.user.id;
    const isMember = project.members.some(member => member.user_id === req.user.id);

    if (!isOwner && !isMember) {
      return sendResponse(res, 403, false, "Bạn không có quyền xem danh sách công việc của dự án này");
    }

    const { page, limit, status, priority, assigneeId, search, sortBy, sortOrder } = req.query;

    const result = await TaskModel.findTasks(projectId, {
      page,
      limit,
      status,
      priority,
      assigneeId,
      search,
      sortBy,
      sortOrder
    });

    return sendResponse(res, 200, true, "Lấy danh sách công việc thành công", result);
  } catch (error) {
    next(error);
  }
});

// api cap nhat thong tin cong viec (chi chu du an)
router.put('/tasks/:id', isProjectOwner, async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    
    // kiem tra nguoi duoc giao moi co phai thanh vien khong
    if (req.body.assignee_id) {
      const task = await TaskModel.findById(taskId);
      const isMember = await ProjectModel.isMember(task.project_id, req.body.assignee_id);
      const project = await ProjectModel.findById(task.project_id);
      const isOwner = project.owner_id === parseInt(req.body.assignee_id);

      if (!isMember && !isOwner) {
        return sendResponse(res, 400, false, "Người được phân công phải là thành viên hoặc chủ sở hữu dự án");
      }
    }

    const updatedTask = await TaskModel.update(taskId, req.body);
    return sendResponse(res, 200, true, "Cập nhật công việc thành công", updatedTask);
  } catch (error) {
    next(error);
  }
});

// api xoa cong viec (chi chu du an)
router.delete('/tasks/:id', isProjectOwner, async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    await TaskModel.delete(taskId);
    return sendResponse(res, 200, true, "Xóa công việc thành công");
  } catch (error) {
    next(error);
  }
});

// api cap nhat nhanh trang thai (cho ca owner va member)
router.patch('/tasks/:id/status', async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;

    // kiem tra trang thai hop le
    if (!status || !['todo', 'doing', 'done'].includes(status)) {
      return sendResponse(res, 400, false, "Trạng thái công việc không hợp lệ (todo, doing, done)");
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return sendResponse(res, 404, false, "Không tìm thấy công việc");
    }

    // kiem tra quyen cap nhat cua nguoi dung
    const isOwner = task.project.owner_id === req.user.id;
    const isMember = await ProjectModel.isMember(task.project_id, req.user.id);

    if (!isOwner && !isMember) {
      return sendResponse(res, 403, false, "Bạn không có quyền cập nhật trạng thái công việc này");
    }

    const updatedTask = await TaskModel.updateStatus(taskId, status);
    return sendResponse(res, 200, true, "Cập nhật trạng thái công việc thành công", updatedTask);
  } catch (error) {
    next(error);
  }
});

export default router;

