// npm install mongoose --save
const mongose = require('mongoose');
require('dotenv').config();

// hacemos la conexion a la base de datos
const clientDB = mongose
  .connect(process.env.URI)
  .then((m) => {
    console.log('db conectada');
    // Nos retorna la conexion
    return m.connection.getClient();
  })
  .catch((e) => console.log('Falló la conexion: ' + e));

module.exports = clientDB;
