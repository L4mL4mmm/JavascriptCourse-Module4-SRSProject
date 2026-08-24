import prisma from '../db.js';

export const TaskModel = {
  // tao cong viec moi
  create: async (data) => {
    return await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        due_date: data.due_date ? new Date(data.due_date) : null,
        project: {
          connect: { id: parseInt(data.project_id) }
        },
        // lien ket voi nguoi duoc giao neu co
        ...(data.assignee_id ? {
          assignee: {
            connect: { id: parseInt(data.assignee_id) }
          }
        } : {})
      }
    });
  },

  // tim kiem cong viec bang id
  findById: async (id) => {
    return await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: true,
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  },

  // cap nhat thong tin cong viec
  update: async (id, data) => {
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.due_date !== undefined) updateData.due_date = data.due_date ? new Date(data.due_date) : null;
    
    // cap nhat hoac huy nguoi duoc giao viec
    if (data.assignee_id !== undefined) {
      if (data.assignee_id === null) {
        updateData.assignee = { disconnect: true };
      } else {
        updateData.assignee = { connect: { id: parseInt(data.assignee_id) } };
      }
    }

    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData
    });
  },

  // xoa cong viec
  delete: async (id) => {
    return await prisma.task.delete({
      where: { id: parseInt(id) }
    });
  },

  // cap nhat nhanh trang thai cong viec
  updateStatus: async (id, status) => {
    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status }
    });
  },

  // tim kiem cong viec co bo loc va phan trang
  findTasks: async (projectId, filters = {}) => {
    // tinh toan tham so phan trang skip va take
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { project_id: parseInt(projectId) };

    // ap dung cac dieu kien loc neu co
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.assigneeId) {
      where.assignee_id = parseInt(filters.assigneeId);
    }
    if (filters.search) {
      where.title = {
        contains: filters.search
      };
    }

    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';

    // chay song song lay danh sach va dem tong so item
    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          assignee: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.task.count({ where })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      tasks,
      totalItems,
      totalPages,
      currentPage: page
    };
  }
};

