const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;



db.usuario = require("./usuario.model");
db.rol = require("./rol.model");

db.ciudad = require("./ciudad.model")
db.turno = require("./turno.model")




db.ROLES = ["usuario", "administrador"];





module.exports = db;