const Sequelize = require('sequelize');
const sequelize = require("../util/database");

//Mise en place du modèle de like lié à un message il permet de savoir quel utilisateur like un message
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
    },

    uniqueMsgUsr:{
        type: Sequelize.STRING,
        unique: true,
    }


});

module.exports = Likes;