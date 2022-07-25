const mongoose = require('mongoose');
const { Schema } = mongoose;
// npm i bcrypt
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  tokenConfirm: {
    type: String,
    default: null,
  },
  confirmAccount: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
});

// Usamos un pre para que haga algo antes del el schema, en este caso, guardar la contraseña hasheada
userSchema.pre('save', async function (next) {
  const user = this;
  //validamos si la contraseña ya fue hasheada para no volver a hacerlo
  if (!user.isModified('password')) return next();

  try {
    // hasheamos
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    console.log(error);
    throw new Error('❌ password encoding error');
  }
});

// Comprobamos la contraseña del usuario hasheada
userSchema.methods.comparePassword = async function (candidatePassword) {
  // usamos bcrypt.compare para comparar la contraseña que nos pasan con la que esta registrada y hasheadas en la base de datos
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
