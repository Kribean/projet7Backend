const Message = require("../models/Message");
const Likes = require("../models/Likes");
const User = require("../models/User");
const Commentaire = require("../models/Commentaire");
const Sequelize = require("sequelize");
const fs = require("fs");

/*async function isAdmin(req,res)
{
  let isAdmin = false;
  console.log(req.token);
  console.log('virgin');

  return User.findOne({where:{ id: req.token.userId }})
  .then((user)=>{
    console.log(user);
    console.log('margarita');
    console.log(user.isAdmin);
    return user.isAdmin;})
  .catch(() => false);

  
}*/

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

exports.createMessageWithoutImg = (req, res, next) => {
  console.log(req.body.userId);
  console.log('rueda');

  Message.create({
    userId: req.body.userId,
    descriptif: req.body.descriptif,
    imageUrl: 'NULL'
  })
    .then(() => res.status(201).json({ message: "Utilisateur créé sans image!" }))
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

  User.findOne({where:{ id: req.token.userId }})
  .then((user)=>{
    
    //debut
    Message.findOne({ where: { id: req.params.id } }).
    then((message) => {
      if ((message.userId == req.token.userId) || user.isAdmin) {
        
        if(req.body.previousUrl)
        {
          const filename = message.imageUrl.split("/images/")[1];
          console.log('aoi');
          fs.unlink(`images/${filename}`,()=>console.log('image supprimée'));
        };
        
        const messageObject = req.file
          ? {
              descriptif: req.body.descriptif,
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : {descriptif: req.body.descriptif,
            imageUrl:NULL };
        Message.update(messageObject, { where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res
          .status(401)
          .json({ message: "vous n'etes pas authorisé à modifier ce message" });
      }
    });
    //fin

})
  .catch(() => console.log('erreur'));


};

exports.modifyMessageWithoutImg = (req, res, next) => {
  console.log('tofu');
  const messageObject ={
    descriptif: req.body.descriptif,
    imageUrl: 'NULL',
  }

  User.findOne({where:{ id: req.token.userId }})
  .then((user)=>{
    if(user.isAdmin)
    {
            //debut
            Message.update(messageObject, { where: { id: req.params.id} })
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
            //fin

    }else
    {
      //debut
      Message.update(messageObject, { where: { id: req.params.id, userId:req.token.userId } })
      .then(() => res.status(200).json({ message: "Objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
      //fin
    }

  })

  /*debut
  const messageObject ={
    descriptif: req.body.descriptif,
    imageUrl: 'NULL',
  }
  Message.update(messageObject, { where: { id: req.params.id, userId:req.token.userId } })
  .then(() => res.status(200).json({ message: "Objet modifié !" }))
  .catch((error) => res.status(400).json({ error }));
  fin*/

  /*Message.findOne({ where: { id: req.params.id } }).then((message) => {
    console.log('tofos');
    if (message.userId == req.token.userId) {
      const messageObject ={
            descriptif: req.body.descriptif,
            imageUrl: 'NULL',
          }
 
      Message.update(messageObject, { where: { id: req.params.id, userId:req.token.userId } })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      res
        .status(401)
        .json({ message: "vous n'etes pas authorisé à modifier ce message" });
    }
  });*/
};

exports.deleteMessage = (req, res, next) => {

  User.findOne({where:{ id: req.token.userId }})
  .then((user)=>{

      //debut
  Message.findOne({ where: { id: req.params.id } })
  .then((message) => {
    if ((message.userId == req.token.userId) || user.isAdmin) {
      const filename = message.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Message.destroy({ where: { id: req.params.id } })
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
  //fin

  }) 
  .catch(()=>console.log('une erreur est avérée'))


};

exports.deleteMessageWithoutImg = (req, res, next) => {

  User.findOne({where:{ id: req.token.userId }})
  .then((user)=>{
    if(user.isAdmin)
    {
      Message.destroy({ where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
    }
    else{
      Message.destroy({ where: { id: req.params.id, userId:req.token.userId } })
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
    }
  })
  .catch(()=>console.log('une erreur est avérée'))



};

exports.likeMessage = (req, res, next) => {

    if(req.body.like == 1)
    {
      Likes.create({
        jaime: true,
        userId: req.token.userId,
        messageId:req.params.id,
        uniqueMsgUsr:req.params.id+'a'+req.token.userId
      })
      .then(()=>console.log('like créé'))
      .catch(()=>console.log('like déjà créé'))
    }
    else if(req.body.like == 0)
    {
      Likes.destroy({ where: { messageId:req.params.id, userId: req.token.userId } })
      .then(() => {console.log('like detruit')}) 
    }

};
