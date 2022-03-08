const Sequelize = require('sequelize');

//connection à la base de données
const sequelize = new Sequelize('projet7', 'root', 'Azerty_972', {
    host:'localhost',
    dialect: 'mysql',
  });

  module.exports = sequelize;