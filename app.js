//utilisation des variables d'environnements (permet une meilleure gestion sécuritaire)
require('dotenv').config();

const express = require('express');
const path = require('path');
const sequelize = require('./util/database');
const user = require('./models/User');
const message = require('./models/Message');
const commentaire = require('./models/Commentaire');
const likes = require('./models/Likes');

console.log('san');
user.hasMany(message);
console.log('yon');
message.hasMany(commentaire);
console.log('go');
user.hasMany(commentaire);
console.log('nana');
message.hasMany(likes);
console.log('roku');
user.hasMany(likes);
console.log('ni');
sequelize
.sync()
.then((result)=>{
    //console.log(result);
})
.catch((err)=>{
    //console.log(err);
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
app.use('/api/message',messageRoutes); //routes vers les actions dédiées aux sauces
app.use('/images', express.static(path.join(__dirname, 'images'))); //permet de l'enregistrement des images dans le dossier image
module.exports = app;