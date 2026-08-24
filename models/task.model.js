import prisma from '../db.js';

export const TaskModel = {
  /**
   * Create a new task.
   * @param {object} data - { project_id, assignee_id, title, description, status, priority, due_date }
   * @returns {Promise<object>}
   */
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
        // Connect assignee if provided
        ...(data.assignee_id ? {
          assignee: {
            connect: { id: parseInt(data.assignee_id) }
          }
        } : {})
      }
    });
  },

  /**
   * Find a task by its ID.
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
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

  /**
   * Update a task.
   * @param {number} id 
   * @param {object} data - { title, description, status, priority, due_date, assignee_id }
   * @returns {Promise<object>}
   */
  update: async (id, data) => {
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.due_date !== undefined) updateData.due_date = data.due_date ? new Date(data.due_date) : null;
    
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

  /**
   * Delete a task.
   * @param {number} id 
   * @returns {Promise<object>}
   */
  delete: async (id) => {
    return await prisma.task.delete({
      where: { id: parseInt(id) }
    });
  },

  /**
   * Update task status.
   * @param {number} id 
   * @param {string} status - 'todo' | 'doing' | 'done'
   * @returns {Promise<object>}
   */
  updateStatus: async (id, status) => {
    return await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status }
    });
  },

  /**
   * List tasks for a project with filters, sorting, searching, and pagination.
   * @param {number} projectId 
   * @param {object} filters - { page, limit, status, priority, assigneeId, search, sortBy, sortOrder }
   * @returns {Promise<object>}
   */
  findTasks: async (projectId, filters = {}) => {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { project_id: parseInt(projectId) };

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
