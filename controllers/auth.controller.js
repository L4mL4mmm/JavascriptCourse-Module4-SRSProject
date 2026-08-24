import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { sendResponse } from '../utils/response.js';

const router = express.Router();

// api dang ky tai khoan moi
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // kiem tra thong tin gui len
    if (!name || !email || !password) {
      return sendResponse(res, 400, false, "Thiếu thông tin đăng ký (name, email, password)");
    }

    // kiem tra email da duoc su dung chua
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return sendResponse(res, 400, false, "Email đã được sử dụng");
    }

    // ma hoa mat khau truoc khi luu
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    // loai bo mat khau khoi phan hoi tra ve
    const { password: _, ...userWithoutPassword } = user;

    return sendResponse(res, 201, true, "Đăng ký tài khoản thành công", userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// api dang nhap nguoi dung
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // kiem tra thong tin nhap vao
    if (!email || !password) {
      return sendResponse(res, 400, false, "Thiếu email hoặc mật khẩu");
    }

    // tim kiem nguoi dung theo email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return sendResponse(res, 401, false, "Email hoặc mật khẩu không chính xác");
    }

    // so sanh mat khau da ma hoa
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Email hoặc mật khẩu không chính xác");
    }

    // tao token jwt luu thong tin dang nhap
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'super_secret_jwt_key_hedspi_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return sendResponse(res, 200, true, "Đăng nhập thành công", {
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
});

export default router;

