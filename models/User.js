const Sequelize = require('sequelize');
const sequelize = require("../util/database");

//Mise en place du modèle de utilisateur comprenant le nom, prenom,pseudonyme, email, mot de passe et un paramètre permettant de savoir si il est admin ou pas 
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
    },
    isAdmin:{
        type: Sequelize.BOOLEAN,
        defaultValue:false,
        allowNull:false,
    }
});

module.exports = User;