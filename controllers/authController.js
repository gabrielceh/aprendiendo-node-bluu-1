const User = require('../models/User');
const { nanoid } = require('nanoid');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.json(errors);
    req.flash('messages', errors.array());
    return res.redirect('/auth/register');
  }

  const { username, email, password } = req.body;
  try {
    // Validamos si el usuario existe en la base de datos
    let user = await User.findOne({ email: email });
    if (user) {
      throw new Error('Email is already registered');
    }
    // Creamos el Schema del usuario para luego guardar
    user = new User({
      username,
      email,
      password,
      tokenConfirm: nanoid(),
    });
    // Guarda en la base de datos
    await user.save();
    // res.json(user);
    req.flash('messages', [
      { msg: 'Registered user successfully. Check your email and validate your account' },
    ]);
    return res.redirect('/auth/login');
  } catch (error) {
    console.log(error);
    // res.json({ error: error.message });
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/auth/register');
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error('User not found');
    user.confirmAccount = true;
    user.tokenConfirm = null;
    await user.save();
    // res.json(user);
    console.log(user);
    req.flash('messages', [{ msg: 'Verified account 🥳' }]);
    return res.redirect('/auth/login');
  } catch (error) {
    res.json({ error: error.message });
  }
};

const registerForm = (req, res) => {
  return res.render('register', { messages: req.flash('messages') });
};

const loginForm = (req, res) => {
  res.render('login', { messages: req.flash('messages') });
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.json(errors.array())
    req.flash('messages', errors.array());
    return res.redirect('/auth/login');
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error('Invalid email or password');

    if (!user.confirmAccount) throw new Error('Unconfirmed account');

    if (!(await user.comparePassword(password))) throw new Error('Invalid email or password');

    // Passport: creando la sesion de usuario
    req.login(user, function (err) {
      if (err) throw new Error('Error creating session');
      return res.redirect('/');
    });
  } catch (error) {
    console.log(error.message);
    req.flash('messages', [{ msg: error.message }]);
    return res.redirect('/auth/login');
    // res.json({ error: error.message });
  }
};

//Cerramos sesion con passport
const logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmAccount,
  loginUser,
  logoutUser,
};
