// Esto es de passport para la ruta protegida
module.exports = (req, res, next) => {
  //Passport validara si hay un usuario autenticado
  if (req.isAuthenticated()) {
    //si es cierto, nos llevara a la ruta inidcada
    return next();
  }
  // si es falso nos llevará al login
  res.redirect('/auth/login');
};
