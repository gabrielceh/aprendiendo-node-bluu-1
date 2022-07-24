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
const validateUrl = require('../middlewares/validateUrl');
const verifyUserDB = require('../middlewares/verifyUserDB');

//creamos la ruta inicial
router.get('/', verifyUserDB, readUrls);
router.post('/', validateUrl, addUrls);

router.get('/delete/:id', deleteUrl);

router.get('/edit/:id', editUrlForm);
router.post('/edit/:id', validateUrl, editUrl);

router.get('/:shortUrl', toRedirect);

module.exports = router;
