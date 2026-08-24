import prisma from '../db.js';

export const UserModel = {
  // tim kiem nguoi dung bang email
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  // tim kiem nguoi dung bang id
  findById: async (id) => {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
  },

  // tao moi tai khoan nguoi dung
  create: async (data) => {
    return await prisma.user.create({
      data
    });
  }
};

