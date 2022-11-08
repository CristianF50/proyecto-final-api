const mongoose = require("mongoose");
const Producto = mongoose.model(
    "Producto",
    new mongoose.Schema({
        descripcion: String,
        sku: String,
        cantidad: Number,
        costo: Number,
        precio: Number,
        minimo: Number,
        status: {
            type: Number,
            default: 0
        },
    })
)
module.exports = Producto;