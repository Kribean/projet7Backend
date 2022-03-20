const Message = require("../models/Message");
const Commentaire = require("../models/Commentaire");
const User = require("../models/User");

/**
 * @name addComment
 * @param {objet} [req] requete contenant l'id du message a commenter ainsi que le contenu du commentaire
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns ajoute un commmentaire à un message
 */
exports.addComment = (req, res, next) => {
  if (req.body.descriptif) {
    Message.findOne({ where: { id: req.params.id } }).then((message) => {
      {
        Commentaire.create({
          descriptif: req.body.descriptif,
          userId: req.token.userId,
          messageId: req.params.id,
        }).then(() => {
          console.log("exécuté");
        });
      }
    });
  }
};

/**
 * @name deleteComment
 * @param {objet} [req] requete contenant l'id du message et de l'utilisateur souhaitant supprimer le commentaire
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns supprime un commmentaire à un message si c'est bien l'auteur du commentaire
 */
exports.deleteComment = (req, res, next) => {
  Commentaire.findOne({ where: { id: req.params.idComment } }).then(
    (comment) => {
      if (comment.userId == req.token.userId) {
        Commentaire.destroy({ where: { id: req.params.idComment } })
          .then((res) => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    }
  );
};

/**
 * @name allCommentsForOneMessage
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns récupère tous les commentaires lié à un message particulier
 */
exports.allCommentsForOneMessage = (req, res, next) => {
  Commentaire.findAll({
    where: { messageId: req.params.id },
    include: [
      {
        model: User,
        attributes: ["id", "pseudo", "createdAt"],
      },
    ],
  })
    .then((com) => {
      res.status(200).json(com);
    })
    .catch((error) => res.status(400).json({ error }));
};

/**
 * @name modifyComment
 * @param {objet} [req] requete contenant la nouvelle description du commentaire
 * @param {objet} [res] envoie un message si l'étape à fonctionnée ou pas
 * @returns modifie un commmentaire à un message
 */
exports.modifyComment = (req, res, next) => {
  Commentaire.update(
    { descriptif: req.body.descriptif },
    { where: { id: req.params.idComment, userId: req.token.userId } }
  )
    .then(() => {
      return res.status(200).json({ message: "Objet modifié !" });
    })
    .catch((error) => res.status(400).json({ error }));
};
