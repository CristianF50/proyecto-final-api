const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const MongooseAggregatePaginateV2 = require('mongoose-aggregate-paginate-v2');
const Sugerencia = mongoose.Schema(
     {
          nombre: String,
          email: String,
          sugerencia: String,

     });

Sugerencia.plugin(mongoosePaginate);
Sugerencia.plugin(MongooseAggregatePaginateV2);
module.exports = mongoose.model('sugerencia', Sugerencia);