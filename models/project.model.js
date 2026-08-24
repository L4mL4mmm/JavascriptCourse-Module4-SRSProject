import prisma from '../db.js';

export const ProjectModel = {
  /**
   * Create a new project.
   * @param {object} data - { name, description, start_date, end_date, owner_id }
   * @returns {Promise<object>}
   */
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

  /**
   * Get all projects where the user is the owner or a member.
   * @param {number} userId 
   * @returns {Promise<array>}
   */
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

  /**
   * Get project details by ID.
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
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

  /**
   * Update project details.
   * @param {number} id 
   * @param {object} data - { name, description, start_date, end_date }
   * @returns {Promise<object>}
   */
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

  /**
   * Delete a project (cascades task deletion via DB definition).
   * @param {number} id 
   * @returns {Promise<object>}
   */
  delete: async (id) => {
    return await prisma.project.delete({
      where: { id: parseInt(id) }
    });
  },

  /**
   * Add a member to a project.
   * @param {number} projectId 
   * @param {number} userId 
   * @returns {Promise<object>}
   */
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

  /**
   * Remove a member from a project.
   * @param {number} projectId 
   * @param {number} userId 
   * @returns {Promise<object>}
   */
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

  /**
   * Check if a user is already a member of a project.
   * @param {number} projectId 
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
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
