//utilisation des variables d'environnements (permet une meilleure gestion sécuritaire)
require('dotenv').config();

const express = require('express');
const path = require('path');
const sequelize = require('./util/database');
const user = require('./models/User');
const message = require('./models/Message');
const commentaire = require('./models/Commentaire');
const likes = require('./models/Likes');

user.hasMany(message,{ onDelete: 'CASCADE' });
message.belongsTo(user);
message.hasMany(commentaire,{ onDelete: 'CASCADE' });
user.hasMany(commentaire,{ onDelete: 'CASCADE' });
commentaire.belongsTo(user);
message.hasMany(likes,{ onDelete: 'CASCADE' });
user.hasMany(likes);

sequelize
.sync()
.then((result)=>{
   
})
.catch((err)=>{
    
});

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

  const app = express();
  app.use(express.json());

  //définition des accès possible via le front
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//connexion aux routes
app.use('/api/auth', userRoutes); //routes vers les actions dédiées à l'utilisateur
app.use('/api/message',messageRoutes); //routes vers les actions dédiées aux messages et aux commentaires
app.use('/images', express.static(path.join(__dirname, 'images'))); //permet l'enregistrement des images dans le dossier image
module.exports = app;