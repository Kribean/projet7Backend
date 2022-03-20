const Sequelize = require('sequelize');
const sequelize = require("../util/database");

//Mise en place du modèle Commentaire permetttant de commenter un message
const Commentaire = sequelize.define("commentaire",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    descriptif:{
        type: Sequelize.STRING(1234),
        allowNull:false,
    }
});

module.exports = Commentaire;