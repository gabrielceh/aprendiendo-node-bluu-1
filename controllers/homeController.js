// Importamos el modelo
const Url = require('../models/Url');

const { nanoid } = require('nanoid');

const readUrls = async (req, res) => {
  // req.user solo estara disponible si lo creamos con passport
  // console.log(req.user);
  try {
    //usamos el find para que nos encuentre los dctos deseados y el lean para pasarlos a objetos de js
    // https://mongoosejs.com/docs/tutorials/lean.html
    const urls = await Url.find({ user: req.user.id }).lean();
    // console.log(urls);
    return res.render('home', { urls: urls });
  } catch (error) {
    console.log(error);
    // res.send('❌ Error, algo falló');
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const addUrls = async (req, res) => {
  const { origin } = req.body;
  const data = {
    origin,
    shortURL: nanoid(10),
    user: req.user.id,
  };
  try {
    const url = new Url(data);
    // console.log(url);
    await url.save();
    req.flash('messages', [{ msg: 'URL added successfully 🥳' }]);
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // await Url.findByIdAndDelete(id);
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error('Operation rejected. You are not the correct user 😡😡');
    }
    await url.remove();
    req.flash('messages', [{ msg: 'URL removed successfully 🥳' }]);
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const editUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    // https://mongoosejs.com/docs/api.html#model_Model-findById
    const url = await Url.findById(id).lean();

    if (!url.user.equals(req.user.id)) {
      throw new Error('Operation rejected. You are not the correct user 😡😡');
    }

    return res.render('home', { url });
  } catch (error) {
    console.log(error);
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const editUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error('Operation rejected. You are not the correct user 😡😡');
    }
    // https://mongoosejs.com/docs/api.html#model_Model-findByIdAndUpdate
    // await Url.findByIdAndUpdate(id, { origin }).lean();

    await url.updateOne({ origin: origin });

    return res.redirect('/');
  } catch (error) {
    console.log(error);
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/');
  }
};

const toRedirect = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const urlDB = await Url.findOne({ shortURL: shortUrl });
    return res.redirect(urlDB.origin);
  } catch (error) {
    req.flash('messages', [{ msg: '❌ Invalid shortcut' }]);
    return res.redirect('/auth/login');
  }
};

module.exports = {
  readUrls,
  addUrls,
  deleteUrl,
  editUrl,
  editUrlForm,
  toRedirect,
};
