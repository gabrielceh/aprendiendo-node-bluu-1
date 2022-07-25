const mongose = require('mongoose');
// const { nanoid } = require('nanoid');

// LLamamos a la clase Schema de mongoose
const { Schema } = mongose;

// Definimos el Schema: el Schema define como va a ser nuestro documento
const urlSchema = new Schema({
  // Aqui estaran las propiedades
  origin: {
    type: String,
    unique: true,
    required: true,
  },
  shortURL: {
    type: String,
    unique: true,
    required: true,
    // Solo para nanoid, tambien se puede crear en el controlador
    // default: () => nanoid(10),
  },
  user: {
    type: Schema.Types.ObjectId,
    // Hace referencia al modelo User
    ref: 'User',
    required: true,
  },
});

// Creamos el modelo pasandole el nombre de la coleccion y el Schema
const Url = mongose.model('Url', urlSchema);
module.exports = Url;
