// nmp i express
const express = require('express');
// npm i express-session
const session = require('express-session');
// npm i connect-flash
const flash = require('connect-flash');
//  npm install passport
const passport = require('passport');
// npm install connect-mongo
const MongoStore = require('connect-mongo');
// npm i express-handlebars
// https://www.npmjs.com/package/express-handlebars
const { create } = require('express-handlebars');
// npm install csurf
//nos sirve para validar que los datos que le enviemos sean de nuestra pagina
const csurf = require('csurf');
// npm i express-mongo-sanitize
// evita la inyeccion de codigo a mongo
const mongoSanitize = require('express-mongo-sanitize');
// npm install cors
// https://expressjs.com/en/resources/middleware/cors.html
const cors = require('cors');

// LLamamos a las variables de entorno
require('dotenv').config();
// LLamamos a la base de datos
// require('./database/db');
const clientDB = require('./database/db');

const User = require('./models/User');
const app = express();

const corsOptions = {
  credentials: true,
  origin: process.env.PATHHEROKU || '*',
  methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

app.set('trust proxy', 1);
// https://expressjs.com/en/resources/middleware/session.html
app.use(
  session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: 'user-session',
    store: MongoStore.create({
      clientPromise: clientDB,
      // Nombre de la base de datos
      dbName: process.env.DBNAME,
    }),
    cookie: {
      secure: process.env.MODE === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
// https://www.npmjs.com/package/connect-flash
app.use(flash());

//Ejemplo de ruta protegida y sesiones
// app.get('/ruta-protegida', (req, res) => {
//   res.json(req.session.usuario || 'Sin sesion de usuario');
// });
// app.get('/crear-sesion', (req, res) => {
//   req.session.usuario = 'gabriel';
//   res.redirect('/ruta-protegida');
// });
// app.get('/destruir-sesion', (req, res) => {
//   req.session.destroy();
//   res.redirect('/ruta-protegida');
// });

// Ejemplos de flash
// app.get('/mensaje-flash', (req, res) => {
//   // si se llega a llamar en consola primero, el mensaje se destruye despues de mostrarse en la consola y no pasara a la sgte instruccion
//   res.json(req.flash('mensaje'));
// });
// app.get('/campos-validados', (req, res) => {
//   req.flash('mensaje', 'todos los campos fueron validados');
//   res.redirect('/mensaje-flash');
// });

// Le indicamos a passport que inicie
app.use(passport.initialize());
app.use(passport.session());

//Esto creara la sesion del usuario
// El req.user funcionara si lo creamos aqui, de lo contrario no estara disponible
// estos datos vienen de la ruta de login, mediante el metodo req.login
passport.serializeUser((user, done) =>
  done(null, {
    id: user._id,
    username: user.username,
  })
);
// cada vez que se refresque el sitio o se actualice la sesion
passport.deserializeUser(async (user, done) => {
  //LLamamos a la base de datos para consultar el usuario
  const userDB = await User.findById(user.id);
  return done(null, {
    id: userDB._id,
    username: userDB.username,
  });
});

const hbs = create({
  extname: '.hbs',
  partialsDir: ['views/components'],
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

// https://expressjs.com/es/starter/static-files.html

// habilitamos los formularios antes de las rutas
app.use(express.urlencoded({ extended: true }));

app.use(csurf());
app.use(mongoSanitize());
// Middleware de csurf para usarlo de forma global y no tener que colocarlo en cada ruta
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  //Para no tener que llamar a req.flash en las rutas que reenderizan
  res.locals.messages = req.flash('messages');
  next();
});

//Llamamos a las rutas que estan en router
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));
app.use(express.static(__dirname + '/public'));

// npm i dotenv
// Configuramos el puerto con la variable de entorno de jeroku
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Servidor conectado 💖 ' + PORT));
