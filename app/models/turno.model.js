const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const MongooseAggregatePaginateV2 = require('mongoose-aggregate-paginate-v2');


const Turno = mongoose.Schema(
{
     nombre_tramite: {type: String, required: true},        
     nombres: { type: String, required: true},
     materno: { type: String, required: true},
     paterno: { type: String, required: true},
     nivel: { type: String, required: true},
     turno: { type: Number, default: 0},
     fecha: { type: Date, default: Date.now},
     asunto: { type: String, required: true},
     telefono: { type: String, required: true},
     celular: { type: String, required: true},
     ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'ciudad', required: true},
     curp: { type: String, required: true, unique: true},
     correo: { type: String, required: true},
     // 0 - Pendiente
     // 1 - Atendido
     estatus: { type: Number, default: 0},
     }
);    
Turno.plugin(mongoosePaginate);
Turno.plugin(MongooseAggregatePaginateV2);
module.exports = mongoose.model('turno', Turno);