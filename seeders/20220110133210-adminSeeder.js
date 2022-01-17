'use strict';
const {hashPassword} = require('../utils/bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword("admin"),
            isAdmin: true,
            createdAt : new Date(),
            updatedAt : new Date()
        },
        {
            name: "Admin2",
            email: "admin2@gmail.com",
            password: hashPassword("admin2"),
            isAdmin: true,
            createdAt : new Date(),
            updatedAt : new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
  }
};
