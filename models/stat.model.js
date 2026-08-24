import prisma from '../db.js';

export const StatModel = {
  /**
   * Get task statistics for a specific project.
   * @param {number} projectId 
   * @returns {Promise<object>}
   */
  getProjectStats: async (projectId) => {
    const projectIdInt = parseInt(projectId);

    // 1. Total number of tasks in the project
    const totalTasks = await prisma.task.count({
      where: { project_id: projectIdInt }
    });

    // 2. Tasks grouped by status (todo, doing, done)
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

    // 3. Number of overdue tasks (due_date < now and status != done)
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

  /**
   * Get task statistics for the current user.
   * @param {number} userId 
   * @returns {Promise<object>}
   */
  getUserStats: async (userId) => {
    const userIdInt = parseInt(userId);

    // 1. Total tasks assigned to the user
    const totalAssigned = await prisma.task.count({
      where: { assignee_id: userIdInt }
    });

    // 2. Total completed tasks assigned to the user
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
