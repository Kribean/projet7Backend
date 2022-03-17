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
        .then((res) => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      }
    });


    };

    exports.allCommentsForOneMessage = (req, res, next) => {
      console.log('st kit');
      console.log(req.params.id);
        Commentaire.findAll(
          { where:{messageId: req.params.id },
            include: [
              {
                model:User,
                attributes:['id','pseudo','createdAt']
              },
              
            ],
          })
        .then((com)=> {
          console.log(com);
          res.status(200).json(com)})
        .catch(error => res.status(400).json({ error }));
        };

    exports.modifyComment = (req, res, next) =>{
      
      console.log('vin di mwen 1');
      console.log(req.params.idComment);
      console.log(req.token.userId);
      console.log(req.body.descriptif);
      Commentaire.update({descriptif:req.body.descriptif}, { where: { id: req.params.idComment, userId:req.token.userId } })
      .then(() => {
        console.log('vin di mwen 1');
        return res.status(200).json({ message: "Objet modifié !" })})
      .catch((error) => res.status(400).json({ error }));
    }