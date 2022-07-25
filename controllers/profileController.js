// npm i formidable
// PAra poder guardar las imagenes en el servidor
const formidable = require('formidable');
// npm i jimp
// Nos sirve para modificar la imagen
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

module.exports.formPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res.render('profile', { user: req.user, img: user.image });
  } catch (error) {
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/profile');
  }
};

module.exports.editProfilePhoto = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize = 2 * 1024 * 1024; // 5mb
  const imgTypes = ['image/png', 'image/jpeg'];

  // Procesamos la imagen
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error('Error while uploading the image');
      }
      // console.log('files:', files);
      // myFile es el name del input
      const file = files.myFile;

      if (file.originalFilename === '') {
        throw new Error('Add an image 🤔');
      }
      // if(!file.mimetype === 'image/png' || !file.mimetype !== 'image/jpeg'){
      //   throw new Error('The file must be a .png or .jpg image 🙁')
      // }

      if (!imgTypes.includes(file.mimetype)) {
        throw new Error('The file must be a .png or .jpg image 🙁');
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image size must be less than 2mb');
      }

      const extension = file.mimetype.split('/')[1];
      const dirFile = path.join(__dirname, `../public/assets/profiles/${req.user.id}.${extension}`);
      // console.log(dirFile);
      // renombra un archivo (param 1) con un nuevo nombre(param 2) y lo guarda
      fs.renameSync(file.filepath, dirFile);

      // Leemos el archivo
      const image = await Jimp.read(dirFile);
      //resize =  Cambia el tamaño pero no la redimensiona
      // quality = calida de la imagen
      // writeAsync = guarda
      // scale= redimensiona la imagen https://www.geeksforgeeks.org/node-jimp-scale/?ref=gcse
      // image.resize(500, 500).quality(90).writeAsync(dirFile);
      image.scale(0.5).quality(90).writeAsync(dirFile);

      // guardanos en la db
      const user = await User.findById(req.user.id);
      user.image = `${req.user.id}.${extension}`;
      await user.save();

      req.flash('messages', [{ msg: 'Image uploaded successfully 🥳' }]);
      // return res.redirect('/profile');
    } catch (error) {
      console.log(error);
      req.flash('messages', [{ msg: error.message }]);
      // return res.redirect('/profile');
    } finally {
      return res.redirect('/profile');
    }
  });
};
