require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
/**
 * @name signup
 * @param {objet} [req] requete contenant les informations de l'utilisateur (email,nom,prenom,pseudo) et le mot de passe liée à la page signup
 * @param {objet} [res] après étape de sauvegarde, envoie un message si l'étape a fonctionné ou pas
 */

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.motDePasse, 10) //hashage du code avec 10 tours
    .then((hash) => {
      User.create({
        nom: req.body.nom,
        prenom: req.body.prenom,
        pseudo: req.body.pseudo,
        email: req.body.email,
        motDePasse: hash,
      })
        .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * @name login
 * @param {objet} [req] requete contenant l'email et le mot de passe liée à la page login
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns renvoie sur la page des produits
 */
exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.motDePasse, user.motDePasse) //compare le mot de passe rentré au mot de passe présent en base de donnée
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            //création du token
            pseudo: user.pseudo,
            nom: user.nom,
            prenom: user.prenom,
            userId: user.id,
            isAdmin: user.isAdmin,
            token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


/**
 * @name modifyProfil
 * @param {objet} [req] requete contenant le nom, prenom,pseudo
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns modifie le nom, prenom et pseudo
 */
exports.modifyProfil = (req, res, next) => {
  User.update(
    { nom: req.body.nom, prenom: req.body.prenom, pseudo: req.body.pseudo },
    { where: { id: req.token.userId } }
  )
    .then(() => {
      res.status(200).json({ message: "Objet modifié !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/**
 * @name deleteProfil
 * @param {objet} [req] requete contenant l'id de l'utilisateur pour le supprimer
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns suprime l'utilisateur ainsi que tout ses posts
 */
exports.deleteProfil = (req, res, next) => {
  User.destroy({
    where: {
      id: req.token.userId,
    },
  })
    .then((res) => res.status(200).json({ message: "Profil supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
