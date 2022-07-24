// Importamos el modelo
const Url = require('../models/Url');

const { nanoid } = require('nanoid');

const readUrls = async (req, res) => {
  try {
    //usamos el find para que nos encuentre los dctos deseados y el lean para pasarlos a objetos de js
    // https://mongoosejs.com/docs/tutorials/lean.html
    const urls = await Url.find().lean();
    // console.log(urls);
    res.render('home', { urls: urls });
  } catch (error) {
    console.log(error);
    res.send('❌ Error, algo falló');
  }
};

const addUrls = async (req, res) => {
  const { origin } = req.body;
  const data = {
    origin,
    shortURL: nanoid(10),
  };
  try {
    const url = new Url(data);
    // console.log(url);
    await url.save();
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send('❌ Error, algo falló');
  }
};

const deleteUrl = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await Url.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send('❌ Error, algo falló');
  }
};

const editUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    // https://mongoosejs.com/docs/api.html#model_Model-findById
    const url = await Url.findById(id).lean();
    res.render('home', { url });
  } catch (error) {
    console.log(error);
    res.send('❌ Error, algo falló');
  }
};

const editUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    // https://mongoosejs.com/docs/api.html#model_Model-findByIdAndUpdate
    const url = await Url.findByIdAndUpdate(id, { origin }).lean();
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send('❌ Error, algo falló');
  }
};

const toRedirect = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const urlDB = await Url.findOne({ shortURL: shortUrl });
    if (!urlDB?.origin) {
      return res.send('error no existe el redireccionamiento');
    }
    res.redirect(urlDB.origin);
  } catch (erro) {
    console.log(error);
    res.send('❌ Error, algo falló');
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
