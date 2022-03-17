const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const Message = sequelize.define("message",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    descriptif:{
        type: Sequelize.STRING(1234),
        allowNull:false,
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    nbLikes:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
    }
    
});

module.exports = Message;