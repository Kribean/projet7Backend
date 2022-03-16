require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
/**
 * @name signup
 * @param {objet} [req] requete contenant l'email et le mot de passe liée à la page signup
 * @param {objet} [res] après étape de sauvegarde, envoie un message si l'étape à fonctionnée où pas
 */
 console.log('tu es ');
exports.signup = (req, res, next) => {
    console.log('tu es ici ou')
    bcrypt.hash(req.body.motDePasse,10) //hashage du code avec 10 tours
    .then(hash=>{
        console.log('tu es ici ou');
        User.create({
            nom: req.body.nom,
            prenom: req.body.prenom,
            pseudo: req.body.pseudo,
            email: req.body.email,
            motDePasse:hash
        })
        .then(()=>res.status(201).json({message:'Utilisateur créé!'}))
        .catch(error => res.status(400).json({error}))
            
        
    })
    .catch(error => res.status(500).json({error}))

};

/**
 * @name login
 * @param {objet} [req] requete contenant l'email et le mot de passe liée à la page login
 * @param {objet} [res] envoie un message si l'étape à fonctionnée où pas
 * @returns renvoie sur la page des produits
 */
exports.login = (req, res, next) => {
    User.findOne({where:{ email: req.body.email }})
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.motDePasse, user.motDePasse) //compare le mot de passe rentré au mot de passe présent en base de donnée
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              pseudo:user.pseudo,
              nom:user.nom,
              prenom:user.prenom,
              userId: user.id,
              token: jwt.sign(
                  {userId:user.id},
                  'secrek',
                  {expiresIn: '24h'}
              )
            });
            
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


  exports.modifyProfil = (req, res, next) => {
    console.log(req.body.nom);
    console.log('toulouse');
    console.log(req.body.pseudo);
    User.update(
        { nom: req.body.nom,
        prenom: req.body.prenom,
        pseudo: req.body.pseudo},
        { where: { id: req.token.userId } }
      )
      .then(result =>{console.log('update réussi');}
        
      )
      .catch(err =>
        {console.log('update échec');}
      )    
};

exports.deleteProfil = (req, res, next) => {
    User.destroy({
        where: {
             id: req.token.userId 
        }
    })
      .then(result =>{console.log('update réussi');}
        
      )
      .catch(err =>
        {console.log('update échec');}
      )    
};