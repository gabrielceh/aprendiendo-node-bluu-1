// npm install mongoose --save
const mongose = require('mongoose');

// hacemos la conexion a la base de datos
mongose
  .connect(process.env.URI)
  .then(() => console.log('db conectada'))
  .catch((e) => console.log('Falló la conexion: ' + e));
