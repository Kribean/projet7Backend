const express = require('express')  
const router = express.Router();

const messageCtrl =require('../controllers/message') ;
const commentaireCtrl =require('../controllers/commentaire') ;
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
/*---------------------------------
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log('destination finale')
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    console.log('filename ici')
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//--------------------------------------------*/
router.post("/add",auth, multer, messageCtrl.createMessage);
router.get("/", auth, messageCtrl.getAllMessages);
router.get("/:id", auth, messageCtrl.getOneMessage);
router.put("/:id", auth, multer, messageCtrl.modifyMessage);
router.delete("/:id", auth, messageCtrl.deleteMessage);
router.post("/:id/like", auth, messageCtrl.likeMessage);
router.get("/:id/allComments", auth, commentaireCtrl.allCommentsForOneMessage);
router.post("/:id/comments", auth, commentaireCtrl.addComment);
router.delete("/comments/:idComment", auth, commentaireCtrl.deleteComment);
module.exports = router;