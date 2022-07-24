const { URL } = require('url');

const validateUrl = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    // console.log(urlFrontend);
    // si es distinto a null es una url valida
    if (urlFrontend.origin !== 'null') {
      if (urlFrontend.protocol === 'https:' || urlFrontend.protocol === 'https:') {
        // En caso que sea una url valida, pasara al sgte middleware, en este caso para crear o editar
        return next();
      } else {
        throw new Error('No valida 🤔');
      }
    } else {
      throw new Error('No valida 🤔');
    }
  } catch (error) {
    console.log(error);
    res.send('❌ Error');
  }
};

module.exports = validateUrl;
