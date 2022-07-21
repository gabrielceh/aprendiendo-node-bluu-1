const express = require('express');
// npm i express-handlebars
// https://www.npmjs.com/package/express-handlebars
const { create } = require('express-handlebars');
const app = express();

const hbs = create({
  extname: '.hbs',
  partialsDir: ['views/components'],
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

// https://expressjs.com/es/starter/static-files.html

//Llamamos a las rutas que estan en router
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

app.use(express.static(__dirname + '/public'));
app.listen(5000, () => console.log('Servidor conectado 💖'));
