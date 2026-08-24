import prisma from '../db.js';

export const UserModel = {
  /**
   * Find a user by email.
   * @param {string} email 
   * @returns {Promise<object|null>}
   */
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  /**
   * Find a user by ID.
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  findById: async (id) => {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
  },

  /**
   * Create a new user.
   * @param {object} data - { name, email, password }
   * @returns {Promise<object>}
   */
  create: async (data) => {
    return await prisma.user.create({
      data
    });
  }
};
