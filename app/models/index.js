const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;



db.usuario = require("./usuario.model");
db.rol = require("./rol.model");

db.servicios = require("./servicio.model");
db.sugerencias = require("./sugerencias.model");




db.ROLES = ["usuario", "administrador"];





module.exports = db;