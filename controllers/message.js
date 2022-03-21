const Message = require("../models/Message");
const Likes = require("../models/Likes");
const User = require("../models/User");
const Commentaire = require("../models/Commentaire");
const Sequelize = require("sequelize");
const fs = require("fs");

/**
 * @name createMessage
 * @param {objet} [req] requete contenant l'id de l'utilisateur ainsi que le couple message/image du post émis par l'utilisateur
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns enregistre l'image et le commmentaire de l'utilisateur
 */
exports.createMessage = (req, res, next) => {
  Message.create({
    userId: req.body.userID,
    descriptif: req.body.descriptif,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  })
    .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * @name createMessage
 * @param {objet} [req] requete contenant l'id de l'utilisateur ainsi que le message du post émis par l'utilisateur
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns enregistre le commmentaire de l'utilisateur
 */
exports.createMessageWithoutImg = (req, res, next) => {
  Message.create({
    userId: req.body.userId,
    descriptif: req.body.descriptif,
    imageUrl: "NULL",
  })
    .then(() =>
      res.status(201).json({ message: "Utilisateur créé sans image!" })
    )
    .catch((error) => res.status(400).json({ error }));
};

/**
 * @name createMessage
 * @param {objet} [res] contient tout les messages du chat
 * @returns renvoie au chat tous les messages et images édités
 */
exports.getAllMessages = (req, res, next) => {
  Message.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "pseudo", "createdAt"],
      },
      {
        model: Likes,
        attributes: ["id", "jaime", "userId"],
      },
      {
        model: Commentaire,
        include: [
          {
            model: User,
            attributes: ["pseudo"],
          },
        ],
      },
    ],
    order:[['createdAt','DESC']]
  })
    .then((mes) => {
      mes = mes.map((m) => {
        m.setDataValue(
          "likeOrNot",
          m.likes.some((like) => {
            return like.userId == req.token.userId;
          })
        );
        return m;
      });

      return res.status(200).json(mes);
    })
    .catch((error) => res.status(400).json({ error }));
};

/**
 * @name getOneMessage
 * @param {objet} [req] requete contenant l'id de l'utilisateur
 * @param {objet} [res] envoie un fichier json contenant le message ciblé
 * @returns retour du message ciblé
 */
exports.getOneMessage = (req, res, next) => {
  Message.findOne({ where: { id: req.params.id } })
    .then((mes) => res.status(200).json(mes))
    .catch((error) => res.status(404).json({ error }));
};

/**
 * @name modifyMessage
 * @param {objet} [req] requete contenant l'id de l'utilisateur ainsi que le couple message/image du post émis par l'utilisateur
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns modifie l'image et le commmentaire de l'utilisateur
 */
exports.modifyMessage = (req, res, next) => {
  User.findOne({ where: { id: req.token.userId } })
    .then((user) => {
      //debut
      Message.findOne({ where: { id: req.params.id } }).then((message) => {
        if (message.userId == req.token.userId || user.isAdmin) {
          if (req.body.previousUrl) {
            const filename = message.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () =>
              console.log("image supprimée")
            );
          }

          const messageObject = req.file
            ? {
                descriptif: req.body.descriptif,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`,
              }
            : { descriptif: req.body.descriptif, imageUrl: NULL };
          Message.update(messageObject, { where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          res
            .status(401)
            .json({
              message: "vous n'etes pas authorisé à modifier ce message",
            });
        }
      });
      //fin
    })
    .catch(() => console.log("erreur"));
};

/**
 * @name modifyMessageWithoutImg
 * @param {objet} [req] requete contenant l'id de l'utilisateur ainsi que le message du post émis par l'utilisateur
 * @param {objet} [res] envoie un message si l'étape a fonctionné ou pas
 * @returns modifie le commmentaire de l'utilisateur
 */
exports.modifyMessageWithoutImg = (req, res, next) => {
  const messageObject = {
    descriptif: req.body.descriptif,
    imageUrl: "NULL",
  };

  User.findOne({ where: { id: req.token.userId } }).then((user) => {
    if (user.isAdmin) {
      //debut
      Message.update(messageObject, { where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
      //fin
    } else {
      //debut
      Message.update(messageObject, {
        where: { id: req.params.id, userId: req.token.userId },
      })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
      //fin
    }
  });
};

/**
 * @name deleteMessage
 * @param {objet} [req] requete contenant l'id de l'utilisateur ainsi que le couple message/image du post émis par l'utilisateur
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns supprime l'image et le commmentaire de l'utilisateur
 */
exports.deleteMessage = (req, res, next) => {
  User.findOne({ where: { id: req.token.userId } })
    .then((user) => {
      //debut
      Message.findOne({ where: { id: req.params.id } })
        .then((message) => {
          if (message.userId == req.token.userId || user.isAdmin) {
            const filename = message.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              Message.destroy({ where: { id: req.params.id } })
                .then(() =>
                  res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
            });
          } else {
            res.status(401).json({
              message: "vous n'etes pas authorisé à supprimer ce message",
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
      //fin
    })
    .catch(() => console.log("une erreur est avérée"));
};

/**
 * @name deleteMessageWithoutImg
 * @param {objet} [req] requete contenant l'id de l'utilisateur ainsi que l'id  du message et l'url de l'image du post émis par l'utilisateur à supprimer
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns supprime l'image et le commmentaire de l'utilisateur
 */
exports.deleteMessageWithoutImg = (req, res, next) => {
  User.findOne({ where: { id: req.token.userId } })
    .then((user) => {
      //si admin on ne spécifie pas l'id de l'utilisateur dans la recherche du message à détruire
      if (user.isAdmin) 
      {
        Message.destroy({ where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        Message.destroy({
          where: { id: req.params.id, userId: req.token.userId },
        })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch(() => console.log("une erreur est avérée"));
};

/**
 * @name likeMessage
 * @param {objet} [req] requete contenant la valeur du like (0 si c'est un unlike/1 si c'est un like)
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns enregistre en base de donnée le like de l'utilisateur par rapport au message ciblée
 */
exports.likeMessage = (req, res, next) => {
  if (req.body.like == 1) {
    Likes.create({
      jaime: true,
      userId: req.token.userId,
      messageId: req.params.id,
      uniqueMsgUsr: req.params.id + "a" + req.token.userId,
    })
      .then(() => console.log("like créé"))
      .catch(() => console.log("like déjà créé"));
  } else if (req.body.like == 0) {
    Likes.destroy({
      where: { messageId: req.params.id, userId: req.token.userId },
    }).then(() => {
      console.log("like detruit");
    });
  }
};
