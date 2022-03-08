const Sequelize = require('sequelize');
const sequelize = require("../util/database");

const User = sequelize.define("user",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    nom:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    prenom:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    pseudo:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    motDePasse:{
        type: Sequelize.STRING,
        allowNull:false,
    }
});

module.exports = User;