const Message = require("../models/Message");
const Likes = require("../models/Likes");
const User = require("../models/User");
const Commentaire = require("../models/Commentaire");
const Sequelize = require("sequelize");
const fs = require("fs");

exports.createMessage = (req, res, next) => {
  console.log(req.body.descriptif);

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

exports.getAllMessages = (req, res, next) => {
  console.log("dow");
  Message.findAll({
    include: [
      {
        model:User,
        attributes:['id','pseudo','createdAt']
      },
      {
        model:Likes,
        attributes:['id','jaime','userId']
      },
      {
        model: Commentaire,
        include: [{
          model:User,
          attributes:['pseudo']
        }]
      },
    ],
  })
  .then((mes) => {
    
    mes = mes.map((m)=>{
      
      m.setDataValue('likeOrNot',m.likes.some((like)=>{

        return like.userId==req.token.userId
      }));
      return m;
    })
/*     mes = mes.map((m) => {
        m.nbLikes = m.likes.length;
        delete m.likes;
        return m;
      });*/
      /*console.log('naruto2');
      console.log(mes.length);
      let theLikes = [];
      let myLike;
      for (let i=0;i<mes.length;i++){
        console.log('nagato');
        myLike =0;
        Likes.findOne({where:{messageId:mes[i].id,userId:req.token.userId}})
        .then((oneLike)=>{
          if(oneLike)
          {          console.log('sasuke');
          return myLike=1;}
          else
          {
            console.log('sakura');
          }

        })
        theLikes.push(myLike);
      }*/
      return res.status(200).json(mes);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneMessage = (req, res, next) => {
  Message.findOne({ where: { id: req.params.id } })
    .then((mes) => res.status(200).json(mes))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyMessage = (req, res, next) => {
  Message.findOne({ where: { id: req.params.id } }).then((message) => {
    if (message.userId == req.token.userId) {
      const messageObject = req.file
        ? {
            descriptif: req.body.descriptif,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      Message.update(messageObject, { where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      res
        .status(401)
        .json({ message: "vous n'etes pas authorisé à modifier ce message" });
    }
  });
};

exports.deleteMessage = (req, res, next) => {
  Message.findOne({ where: { id: req.params.id } })
    .then((message) => {
      if (message.userId == req.token.userId) {
        const filename = message.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Message.destroy({ where: { _id: req.params.id } })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res
          .status(401)
          .json({
            message: "vous n'etes pas authorisé à supprimer ce message",
          });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeMessage = (req, res, next) => {

    if(req.body.like == 1)
    {
      Likes.create({
        jaime: true,
        userId: req.token.userId,
        messageId:req.params.id,
        uniqueMsgUsr:req.params.id+req.token.userId
      })
      .then(()=>console.log('like créé'))
      .catch(()=>console.log('like déjà créé'))
    }
    else if(req.body.like == 0)
    {
      Likes.destroy({ where: { messageId:req.params.id, userId: req.token.userId } })
      .then(() => {console.log('like detruit')}) 
    }
  /*Message.findOne({ where: { id: req.params.id } }).then((message) => {
    {
      let nombreDeLike;
      let allowAddLike = true;
      Likes.findOne({
        where: { messageId: message.id, userId: req.token.userId },
      }).then(() => {
        allowAddLike = false;
      });
      if (req.body.like == 1 && allowAddLike) {
        Likes.create({
          jaime: true,
          userId: req.token.userId,
          messageId: message.id,
        })
          .then(() => {
            nombreDeLike = Likes.findAndCountAll({
              where: { jaime: true },
            }).then((result) => {
              result.count;
            });
            Message.update(
              { nbLikes: nombreDeLike },
              { where: { id: req.params.id } }
            )
              .then(() => res.status(200).json({ message: "Objet modifié !" }))
              .catch((error) => res.status(400).json({ error }));
            return res
              .status(200)
              .json({ message: "Objet créé !", nombreDeLike: nombreDeLike });
          })
          .catch((error) => res.status(400).json({ error }));
      } else if (req.body.like == 0) {
        Likes.destroy({ where: { userId: req.token.userId } })
          .then(() => {
            nombreDeLike = Likes.findAndCountAll({
              where: { jaime: true },
            }).then((result) => {
              result.count;
            });
            Message.update(
              { nbLikes: nombreDeLike },
              { where: { id: req.params.id } }
            )
              .then(() =>
                res.status(200).json({ message: "Objet mis à jour !" })
              )
              .catch((error) => res.status(400).json({ error }));
            return res
              .status(200)
              .json({ message: "Objet créé !", nombreDeLike: nombreDeLike });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    }
  });*/
};
