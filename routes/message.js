const express = require('express')  
const router = express.Router();

const messageCtrl =require('../controllers/message') ;
const commentaireCtrl =require('../controllers/commentaire') ;
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post("/add",auth, multer, messageCtrl.createMessage);//route liée à la création de messages avec image
router.post("/addWithoutImg",auth, messageCtrl.createMessageWithoutImg); //route liée à la création de messages sans image
router.get("/", auth, messageCtrl.getAllMessages); //route liée à la récupération de tout les messages créés
router.get("/:id", auth, messageCtrl.getOneMessage); //route liée à la récupération d'un message
router.put("/:id/modifyMessage", auth, multer, messageCtrl.modifyMessage); //route permettant la modification d'un message avec image
router.put("/:id/modifyMessageWithoutImg", auth, messageCtrl.modifyMessageWithoutImg); //route permettant la modification d'un message sans image
router.delete("/:id/deleteMsg", auth, messageCtrl.deleteMessage); //suppression d'un message
router.delete("/:id/deleteMsgWithoutImg", auth, messageCtrl.deleteMessageWithoutImg); //suppression d'un message sans image
router.post("/:id/like", auth, messageCtrl.likeMessage); //route liée au like d'un message
router.get("/:id/allComments", auth, commentaireCtrl.allCommentsForOneMessage); //route permettant de récupérer les commentaires pour un message donnée
router.post("/:id/comments", auth, commentaireCtrl.addComment); //route permettant d'émettre un commentaire sur un post
router.delete("/comments/:idComment/deleted", auth, commentaireCtrl.deleteComment); // suppression d'un commentaire
router.put("/comments/:idComment/modified", auth, commentaireCtrl.modifyComment); // modification d'un commentaire
module.exports = router;