import prisma from '../db.js';

export const ProjectModel = {
  // tao moi mot du an
  create: async (data) => {
    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        owner_id: parseInt(data.owner_id)
      }
    });
  },

  // tim cac du an ma user la owner hoac la member
  findByUserId: async (userId) => {
    const id = parseInt(userId);
    return await prisma.project.findMany({
      where: {
        OR: [
          { owner_id: id },
          { members: { some: { user_id: id } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  },

  // tim chi tiet du an bang id kem thong tin thanh vien va task
  findById: async (id) => {
    return await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        tasks: true
      }
    });
  },

  // cap nhat thong tin du an
  update: async (id, data) => {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;

    return await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData
    });
  },

  // xoa du an theo id
  delete: async (id) => {
    return await prisma.project.delete({
      where: { id: parseInt(id) }
    });
  },

  // them thanh vien moi vao du an
  addMember: async (projectId, userId) => {
    return await prisma.projectMember.create({
      data: {
        project_id: parseInt(projectId),
        user_id: parseInt(userId)
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  },

  // xoa thanh vien khoi du an
  removeMember: async (projectId, userId) => {
    return await prisma.projectMember.delete({
      where: {
        project_id_user_id: {
          project_id: parseInt(projectId),
          user_id: parseInt(userId)
        }
      }
    });
  },

  // kiem tra user co phai thanh vien du an khong
  isMember: async (projectId, userId) => {
    const member = await prisma.projectMember.findUnique({
      where: {
        project_id_user_id: {
          project_id: parseInt(projectId),
          user_id: parseInt(userId)
        }
      }
    });
    return !!member;
  }
};

