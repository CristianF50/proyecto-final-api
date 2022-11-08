const mongoose = require("mongoose");
const Ciudad = mongoose.model(
"Ciudad",    
new mongoose.Schema({
     nombre: String,        
     turno: {
          type: Number,
          default: 0
     }
}));    

module.exports = Ciudad;