const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const MongooseAggregatePaginateV2 = require('mongoose-aggregate-paginate-v2');
const Servicios = mongoose.Schema(
     {
          nombre: String,
          precio: Number,
          caracteristicas: [Number],

     });

Servicios.plugin(mongoosePaginate);
Servicios.plugin(MongooseAggregatePaginateV2);
module.exports = mongoose.model('servicio', Servicios);