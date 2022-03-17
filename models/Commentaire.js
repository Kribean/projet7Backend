const Sequelize = require('sequelize');
const sequelize = require("../util/database");

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