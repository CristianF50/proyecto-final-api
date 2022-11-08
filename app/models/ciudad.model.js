const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const MongooseAggregatePaginateV2 = require('mongoose-aggregate-paginate-v2');
const Ciudad = mongoose.Schema(
     {
          nombre: String,
          turno: {
               type: Number,
               default: 0
          },
          resuelto: {
               type: Number,
               default: 0
          },
          pendiente: {
               type: Number,
               default: 0
          }
     });

Ciudad.plugin(mongoosePaginate);
Ciudad.plugin(MongooseAggregatePaginateV2);
module.exports = mongoose.model('ciudad', Ciudad);