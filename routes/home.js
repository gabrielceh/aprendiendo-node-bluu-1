const express = require('express');
const router = express.Router();
const {
  readUrls,
  addUrls,
  deleteUrl,
  editUrlForm,
  editUrl,
  toRedirect,
} = require('../controllers/homeController');
const { formPerfil, editProfilePhoto } = require('../controllers/profileController');
const validateUrl = require('../middlewares/validateUrl');
const verifyUserDB = require('../middlewares/verifyUserDB');

//creamos la ruta inicial
router.get('/', verifyUserDB, readUrls);
router.post('/', verifyUserDB, validateUrl, addUrls);

router.get('/delete/:id', verifyUserDB, deleteUrl);

router.get('/edit/:id', verifyUserDB, editUrlForm);
router.post('/edit/:id', verifyUserDB, validateUrl, editUrl);

router.get('/profile', verifyUserDB, formPerfil);
router.post('/profile', verifyUserDB, editProfilePhoto);

router.get('/:shortUrl', toRedirect);

module.exports = router;
