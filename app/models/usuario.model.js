//Cada model.js es una tabla que se va a crear en la base de datos, mongoose es la libreria que se encarga de comunicarse
// entre el servidor y MongoDB

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const MongooseAggregatePaginateV2 = require('mongoose-aggregate-paginate-v2');


const Usuario = mongoose.Schema(
  {
    email: String,
    clave: String,
    nombre: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rol"
      }
    ]
  }
);

Usuario.plugin(mongoosePaginate);
Usuario.plugin(MongooseAggregatePaginateV2);
module.exports = mongoose.model('usuario', Usuario);