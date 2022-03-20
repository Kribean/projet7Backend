require('dotenv').config();
const Sequelize = require('sequelize');

//connection à la base de données
const sequelize = new Sequelize('projet7', 'root', process.env.DATABASE_ACCESS, {
    host:'localhost',
    dialect: 'mysql',
  });

  module.exports = sequelize;