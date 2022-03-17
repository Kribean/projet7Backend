const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); //route liée au controller permettant le log d'un utilisateur déjà inscrit
router.post('/login', userCtrl.login); //route liée au controller permettant l'inscription d'un utilisateur
router.put('/modifyProfil',auth,userCtrl.modifyProfil); //route liée a la modification d'un utilisateur
router.delete('/deleteProfil',auth, userCtrl.deleteProfil); //route liée a la modification d'un utilisateur

module.exports = router;