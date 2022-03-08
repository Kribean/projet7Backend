const Message =require('../models/Message') ;
const Likes =require('../models/Likes') ;
const fs = require('fs');
const Commentaire = require('../models/Commentaire');


exports.createMessage = (req, res, next) => {

    console.log('tu es ici ou');
    Message.create({
        descriptif: req.body.descriptif,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
    .then(()=>res.status(201).json({message:'Utilisateur créé!'}))
    .catch(error => res.status(400).json({error}))
     
  };

  exports.getAllMessages = (req, res, next) => {
    Message.findAll()
    .then(mes => res.status(200).json(mes))
    .catch(error => res.status(400).json({ error }));

  };

  exports.getOneMessage = (req, res, next) => {
    Message.findOne({where:{ id: req.params.id }})
      .then(mes => res.status(200).json(mes))
      .catch(error => res.status(404).json({ error }));
  };

  exports.modifyMessage = (req, res, next) => {
    Message.findOne({where:{ id: req.params.id }})
    .then((message)=>{
      if(message.userId==req.token.userId) 
      {

      
      const messageObject = req.file ?
      {
        descriptif: req.body.descriptif,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      Message.update(
        messageObject,
        { where: { id: req.params.id } }
      )
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
    }else{
      res.status(401).json({ message:"vous n'etes pas authorisé à modifier cette sauce" });
    }

    })
    
  };

  exports.deleteMessage= (req, res, next) => {
    Sauce.findOne({where:{ id: req.params.id }})
      .then(message => {
        if(message.userId==req.token.userId)
        {
  
          const filename = message.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Message.destroy({where: { _id: req.params.id }})
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error }));
          });
  
      }else{
        res.status(401).json({ message:"vous n'etes pas authorisé à supprimer cette sauce" });
      }
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.likeMessage = (req, res, next) => {
    Message.findOne({where:{  id: req.params.id }})
    .then((message)=>{
        {
            let nombreDeLike;
            if(req.body.like==1){
                Likes.create({jaime:true,userId:req.token.userId})
                .then(() => {
                    nombreDeLike = Likes.findAndCountAll({
                        where: {jaime: true}})
                     .then(result => {
                       result.count;
                     });
                    Message.update(
                        {nbLikes:nombreDeLike},
                        { where: { id: req.params.id } }
                      )
                      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                      .catch(error => res.status(400).json({ error }));
                    return res.status(200).json({ message: 'Objet créé !'})})
                .catch(error => res.status(400).json({ error }));

              }else if(req.body.like==0){
                Likes.destroy({where: { userId: token.userId }})
                .then(() => {
                    nombreDeLike = Likes.findAndCountAll({
                        where: {jaime: true}})
                     .then(result => {
                       result.count;
                     });
                    Message.update(
                        {nbLikes:nombreDeLike},
                        { where: { id: req.params.id } }
                      )
                      .then(() => res.status(200).json({ message: 'Objet mis à jour !'}))
                      .catch(error => res.status(400).json({ error }));
                    return res.status(200).json({ message: 'Objet créé !'})})
                .catch(error => res.status(400).json({ error }));
        
              }
        }


    })

  };

  exports.addComment = (req, res, next) => {
    if (req.body.descriptif)
    {Message.findOne({where:{  id: req.params.id }})
    .then((message)=>{
        {
                Commentaire.create({descriptif:req.body.descriptif,userId:req.token.userId,messageId:req.params.id})
                .then(() => {
                    console.log('exécuté')
                     });
   
        }
    })}

  };

  exports.deleteComment = (req, res, next) => {
    Commentaire.findOne({where:{  id: req.params.idComment }})
    .then( (comment)=>{ 
        if(comment.userId==req.token.userId)
        {
        Commentaire.destroy({where: { id: req.params.idComment }})
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      }
    });


    };

    exports.allCommentsForOneMessage = (req, res, next) => {
        Commentaire.findAll({where:{  messageId: req.params.id }})
        .then(com => res.status(200).json(com))
        .catch(error => res.status(400).json({ error }));
    
    
        };