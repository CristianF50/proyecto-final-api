//Cada model.js es una tabla que se va a crear en la base de datos, mongoose es la libreria que se encarga de comunicarse
// entre el servidor y MongoDB

const mongoose = require("mongoose");
const Usuario = mongoose.model(
  "Usuario",
  new mongoose.Schema({
    email: String,
    clave: String,
    nombre: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rol"
      }
    ]
  })
);
module.exports = Usuario;