const express = require('express');
const router = express.Router();

//creamos la ruta inicial
router.get('/', (req, res) => {
  const urls = [
    {
      origin: 'https://google.com',
      shortUrl: '2bn4mxc',
    },
    {
      origin: 'https://youtube.com',
      shortUrl: '2nj43m',
    },
    {
      origin: 'https://instagram.com',
      shortUrl: 'm24y23',
    },
  ];
  res.render('home', { urls: urls });
});

module.exports = router;
