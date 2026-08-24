import prisma from '../db.js';

export const StatModel = {
  // lay thong ke cong viec cua mot du an
  getProjectStats: async (projectId) => {
    const projectIdInt = parseInt(projectId);

    // 1. dem tong so cong viec cua du an
    const totalTasks = await prisma.task.count({
      where: { project_id: projectIdInt }
    });

    // 2. nhom va dem so cong viec theo tung trang thai
    const statusGroups = await prisma.task.groupBy({
      by: ['status'],
      where: { project_id: projectIdInt },
      _count: { id: true }
    });

    const statusBreakdown = {
      todo: 0,
      doing: 0,
      done: 0
    };
    statusGroups.forEach((group) => {
      statusBreakdown[group.status] = group._count.id;
    });

    // 3. dem so luong cong viec bi qua han
    const overdueTasks = await prisma.task.count({
      where: {
        project_id: projectIdInt,
        status: { not: 'done' },
        due_date: { lt: new Date() }
      }
    });

    return {
      totalTasks,
      statusBreakdown,
      overdueTasks
    };
  },

  // lay thong ke cong viec cua ca nhan nguoi dung
  getUserStats: async (userId) => {
    const userIdInt = parseInt(userId);

    // 1. tong so cong viec duoc giao
    const totalAssigned = await prisma.task.count({
      where: { assignee_id: userIdInt }
    });

    // 2. tong so cong viec duoc giao da hoan thanh
    const completedAssigned = await prisma.task.count({
      where: {
        assignee_id: userIdInt,
        status: 'done'
      }
    });

    return {
      totalAssigned,
      completedAssigned
    };
  }
};

