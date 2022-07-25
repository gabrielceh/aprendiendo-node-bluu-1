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
        console.log('mal');
        throw new Error('❌ The URL needs the protocol http:// or https://');
      }
    }
    console.log(urlFrontend.protocol);
    console.log(urlFrontend.origin);
    throw new Error('❌ Invalid url');
  } catch (error) {
    console.log(error.message);
    // res.send('❌ Error');
    if (error.message === 'Invalid URL') {
      req.flash('messages', [{ msg: '❌ Invalid url' }]);
    } else {
      req.flash('messages', [{ msg: error.message }]);
    }
    return res.redirect('/');
  }
};

module.exports = validateUrl;
