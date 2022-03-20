const Sequelize = require('sequelize');
const sequelize = require("../util/database");

//Mise en place du modèle Messsage. Comprenant un champ descriptif pour le contenu textuel du message, un champ imageUrl comprenant l'adresse de l'image si image et enfin le nombre de like du message
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