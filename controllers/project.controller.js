import express from 'express';
import { ProjectModel } from '../models/project.model.js';
import { UserModel } from '../models/user.model.js';
import { verifyToken, isProjectOwner } from '../middlewares/auth.middleware.js';
import { sendResponse } from '../utils/response.js';

const router = express.Router();

// kiem tra token cho tat ca cac api trong file nay
router.use(verifyToken);

// api lay tat ca cac du an lien quan den user
router.get('/', async (req, res, next) => {
  try {
    const projects = await ProjectModel.findByUserId(req.user.id);
    return sendResponse(res, 200, true, "Lấy danh sách dự án thành công", projects);
  } catch (error) {
    next(error);
  }
});

// api tao du an moi
router.post('/', async (req, res, next) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    // kiem tra ten du an
    if (!name) {
      return sendResponse(res, 400, false, "Tên dự án không được để trống");
    }

    const project = await ProjectModel.create({
      name,
      description,
      start_date,
      end_date,
      owner_id: req.user.id
    });

    return sendResponse(res, 201, true, "Tạo dự án thành công", project);
  } catch (error) {
    next(error);
  }
});

// api lay chi tiet du an theo id
router.get('/:id', async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return sendResponse(res, 404, false, "Không tìm thấy dự án");
    }

    // kiem tra xem co quyen xem khong
    const isOwner = project.owner_id === req.user.id;
    const isMember = project.members.some(member => member.user_id === req.user.id);

    if (!isOwner && !isMember) {
      return sendResponse(res, 403, false, "Bạn không có quyền truy cập thông tin dự án này");
    }

    return sendResponse(res, 200, true, "Lấy chi tiết dự án thành công", project);
  } catch (error) {
    next(error);
  }
});

// api cap nhat thong tin du an (chi danh cho owner)
router.put('/:id', isProjectOwner, async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await ProjectModel.update(projectId, req.body);
    return sendResponse(res, 200, true, "Cập nhật dự án thành công", project);
  } catch (error) {
    next(error);
  }
});

// api xoa du an (chi danh cho owner)
router.delete('/:id', isProjectOwner, async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    await ProjectModel.delete(projectId);
    return sendResponse(res, 200, true, "Xóa dự án thành công");
  } catch (error) {
    next(error);
  }
});

// api them thanh vien vao du an (chi danh cho owner)
router.post('/:id/members', isProjectOwner, async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const { email, userId } = req.body;

    // tim kiem user can them
    let targetUser = null;
    if (email) {
      targetUser = await UserModel.findByEmail(email);
    } else if (userId) {
      targetUser = await UserModel.findById(userId);
    }

    if (!targetUser) {
      return sendResponse(res, 404, false, "Không tìm thấy người dùng");
    }

    const project = await ProjectModel.findById(projectId);

    // chu so huu khong can tu them minh vao
    if (project.owner_id === targetUser.id) {
      return sendResponse(res, 400, false, "Người dùng này là chủ sở hữu dự án, không cần thêm");
    }

    // kiem tra xem da la member chua
    const exists = await ProjectModel.isMember(projectId, targetUser.id);
    if (exists) {
      return sendResponse(res, 400, false, "Người dùng này đã là thành viên của dự án");
    }

    const member = await ProjectModel.addMember(projectId, targetUser.id);
    return sendResponse(res, 201, true, "Thêm thành viên vào dự án thành công", member);
  } catch (error) {
    next(error);
  }
});

// api xoa thanh vien khoi du an (chi danh cho owner)
router.delete('/:id/members/:userId', isProjectOwner, async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id);
    const targetUserId = parseInt(req.params.userId);

    // kiem tra xem co dung la member khong
    const exists = await ProjectModel.isMember(projectId, targetUserId);
    if (!exists) {
      return sendResponse(res, 400, false, "Người dùng không phải là thành viên của dự án này");
    }

    await ProjectModel.removeMember(projectId, targetUserId);
    return sendResponse(res, 200, true, "Xóa thành viên khỏi dự án thành công");
  } catch (error) {
    next(error);
  }
});

export default router;

