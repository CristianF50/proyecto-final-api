const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;
const config = require("../config/auth.config");
const db = require("../models");
const Servicio = db.servicios;



exports.landing = async ({ query }, res) => {
     
    let pipeline = [
        {
          '$limit': 4
        }
      ]

    let servicios = await Servicio.aggregate(pipeline)

    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: servicios
    })

}


exports.list = async ({ query }, res) => {

    let body = query
    let buscar = (query.buscar == undefined) ? '.*' : query.buscar + '.*'

    let pipeline = [
          
        {
            $sort: { fecha: 1 }
        }
    ]
    if (query.buscar) {
        pipeline.push({
            $match: {
                $and: [
                    {
                        $or: [
                            { nombre: new RegExp(buscar, "i") },
                        ]
                    },
                ]
            }

        })
    }

    let turnos

    if (!body.paginate) {
        turnos = await Servicio.aggregate(pipeline)
    } else {
        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            customLabels: {
                totalDocs: 'itemCount',
                docs: 'itemsList',
                limit: 'perPage',
                page: 'currentPage',
                nextPage: 'next',
                prevPage: 'prev',
                totalPages: 'pageCount',
                pagingCounter: 'slNo',
            },
            sort: { fecha: 1 }
        };
        turnos = await Servicio.aggregatePaginate(Servicio.aggregate(pipeline), options)
    }


    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: turnos
    })

};

exports.get = async ({ query }, response) => {

    let servicio = await Servicio.aggregate(
        [
            {
                '$match': {
                    '_id': new ObjectId(query.id)
                }
            }
        ]
    )

    if (servicio != null) {
        return response.status(200).json({
            success: true,
            message: 'Se ha encontrado el servicio',
            data: servicio[0]
        })
    } else {
        return response.status(400).json({
            success: false,
            message: 'No existe el servicio.',
        })
    }


};

exports.add = async ({ body }, res) => {

    const servicio = new Servicio({
        nombre: body.nombre,
        precio: body.precio,
        caracteristicas: body.caracteristicas.split(','),
    })
    servicio.save(async (err, servicio) => {
        if (err) {
            res.status(500).send({ message: err });
            console.log(err)
            return;
        }

        info = await Servicio.findOne({ _id: servicio._id })

        res.status(200).json({
            success: true,
            message: 'Servicio agregado con exito',
            data: info
        })
    })

    console.log(body)
}



exports.update = async ({ body }, res) => {

    console.log(body)

    let servicio = await Servicio.findOne({ _id: ObjectId(body.id) })
    console.log(servicio)
    if (servicio != null) {

        if (body.nombre) servicio.nombre = body.nombre;
        if (body.precio) servicio.precio = body.precio;
        if (body.caracteristicas) servicio.caracteristicas = body.caracteristicas.split(',');

    }

    servicio.save().then((turno) => {
        return res.status(200).json({
            success: true,
            message: "Servicio actualizado"
        })
    }).catch((err) => {
        console.log("error", err)
        return res.status(400).json({
            success: false,
            message: "Servicio No actualizado"
        })
    })
}

exports.delete = async ({ query }, response) => {
    console.log(query)
    await Servicio.deleteOne({ _id: query.id }).then(function () {
        return response.status(200).json({
            success: true,
            message: 'Servicio Eliminado!'
        })
    }).catch(function (error) {
        return response.status(400).json({
            success: false,
            message: handleError(err)
        });
    });

};