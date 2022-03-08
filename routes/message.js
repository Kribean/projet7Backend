const express = require('express')  
const router = express.Router();

const messageCtrl =require('../controllers/message') ;
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post("/add",auth, multer, messageCtrl.createMessage);
router.get("/", auth, messageCtrl.getAllMessages);
router.get("/:id", auth, messageCtrl.getOneMessage);
router.put("/:id", auth, multer, messageCtrl.modifyMessage);
router.delete("/:id", auth, multer, messageCtrl.deleteMessage);
router.post("/:id/like", auth, messageCtrl.likeMessage);
router.get("/:id/allComments", auth, messageCtrl.allCommentsForOneMessage);
router.post("/:id/comments", auth, messageCtrl.addComment);
router.delete("/comments/:idComment", auth, messageCtrl.deleteComment);
module.exports = router;