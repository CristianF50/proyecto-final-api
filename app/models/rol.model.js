//Cada model.js es una tabla que se va a crear en la base de datos, mongoose es la libreria que se encarga de comunicarse
// entre el servidor y MongoDB

const mongoose = require("mongoose");
const Rol = mongoose.model(
  "Rol",
  new mongoose.Schema({
    nombre: String
  })
);
module.exports = Rol;