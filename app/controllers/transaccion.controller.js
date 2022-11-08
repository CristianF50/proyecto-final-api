const config = require("../config/auth.config");
const { producto } = require("../models");
const db = require("../models");
const Transaccion = db.transaccion;
const Producto = db.producto;

exports.list = async ({query}, res) => {

    let body = query
    let buscar = (query.buscar == undefined) ? '.*' : query.buscar + '.*'

    let pipeline = [
        {
            $sort: {createdAt: 1}
        }
    ]
    if (query.buscar) {
        pipeline.push({
            $match: {
                $and: [
                    {
                        $or: [
                            { descripcion: new RegExp(buscar, "i") },
                            { sku: new RegExp(buscar, "i") },
                        ]
                    },
                ]
            }

        })
    }

    let transaccion = await Transaccion.aggregate(pipeline);


    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: transaccion
    })
  
};

exports.get = async ({query}, res) => {
    
    const body = query;


        let producto = null

        if (body.id) {
            producto = await Producto.findOne({ _id: body.id })
            return res.status(200).json({
                success: true,
                message: 'Consulta exitosa',
                data: producto
            })
        }


        else {
            return response.status(400).json({
                success: false,
                message: 'No existe el producto.',
            })
        }
};


exports.add = async (req, res) => {

    let transaccion = new Transaccion(req.body);

    let carrito = req.body.carrito

    carrito.map((item) => {
        Producto.findOne({_id: item.producto_id}).then(
            async (producto) => {
                producto.cantidad = producto.cantidad - item.cantidad
                await producto.save()
            }
        )
    })

    console.log('new servicio', req.body);

    transaccion.save()
        .then(async transaccion => {
            console.log("chichepudo")
            return res.status(200).json({
                success: true,
                message: "Transaccion creada exitosamente"
            })
        })
        .catch(async error => {
            console.log('¿error', error)
            return res.status(400).json({
                success: false,
                message: (error)
            })
        })
};

exports.update = async (req, res) => {
    let body = req.body

    Producto.findOne({ _id: body.id })
    .then(async (producto) => {

        if (producto == null) return response.status(200).json({ err, message: 'Producto no encontrado!', success: false })

        if (body.descripcion !== undefined) producto.descripcion = body.descripcion;
        if (body.sku !== undefined) producto.sku = body.sku;
        if (body.cantidad !== undefined) producto.cantidad = body.cantidad;
        if (body.costo !== undefined) producto.costo = body.costo;
        if (body.precio !== undefined) producto.precio = body.precio;
        if (body.minimo !== undefined) producto.minimo = body.minimo;

        await producto.save()
            .then(async (cli) => {
                return res.status(200).json({
                    success: true,
                    message: 'Cliente Actualizado!'
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(400).json({
                    success: false,
                    errors: error,
                    message: 'Producto no actualizado!',
                })
            })
    })
    .catch((err) => response.status(404).json({ err, message: 'Producto no encontrado!' }));
}