const multer = require('multer');

const MIME_TYPES = {
    //format des fichiers authorisées
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//stockage des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //mise en place du nom de fichier
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);//completion du nom du fichier avec la date et ajout de l'extension
  }
});

module.exports = multer({storage: storage}).single('image');