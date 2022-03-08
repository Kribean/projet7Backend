const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const Likes = sequelize.define("likes",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    jaime:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
});

module.exports = Likes;