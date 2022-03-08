const Message =require('../models/Message') ;
const Commentaire = require('../models/Commentaire');
const User =require('../models/User') ;

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
        Commentaire.findAll({ include: User },{where:{  messageId: req.params.id }})
        .then(com => res.status(200).json(com))
        .catch(error => res.status(400).json({ error }));
    
    
        };