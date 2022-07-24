const express = require('express');
// npm i express-validator
const { body } = require('express-validator');
const {
  loginForm,
  registerForm,
  registerUser,
  confirmAccount,
  loginUser,
  logoutUser,
} = require('../controllers/authController');
const router = express.Router();

router.get('/register', registerForm);
router.post(
  '/register',
  [
    // validaciones del formulario de registro por medio de express-validator
    // https://express-validator.github.io/docs/
    body('username', 'Enter a valid name').trim().notEmpty().escape(),
    body('email', 'Enter a valid email').trim().isEmail().normalizeEmail(),
    body('password', 'Enter at least 6 characters for the password')
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error('Passwords don´t match');
        }
        return value;
      }),
  ],
  registerUser
);
router.get('/confirm-account/:token', confirmAccount);

router.get('/login', loginForm);
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').trim().isEmail().normalizeEmail(),
    body('password', 'Enter at least 6 characters for the password')
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  loginUser
);

router.get('/logout', logoutUser);

module.exports = router;
