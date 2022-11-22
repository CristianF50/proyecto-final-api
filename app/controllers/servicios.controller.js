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

    let usuario = await Usuarios.aggregate(
        [
            {
                '$match': {
                    '_id': new ObjectId(query.id)
                }
            }
        ]
    )

    if (usuario != null) {
        return response.status(200).json({
            success: true,
            message: 'Se ha encontrado el servicio',
            data: usuario[0]
        })
    } else {
        return response.status(400).json({
            success: false,
            message: 'No existe el servicio.',
        })
    }


};

exports.add = async ({ body }, res) => {

    const turno = new Servicio({
        fecha: Date(),
        nombres: body.nombres,
        nombre_tramite: body.nombre_tramite,
        materno: body.materno,
        paterno: body.paterno,
        telefono: body.telefono,
        celular: body.celular,
        correo: body.correo,
        curp: body.curp,
        ciudad: ObjectId(body.ciudad),
        nivel: body.nivel,
        asunto: body.asuntos,
        turno: noturno
    })
    turno.save(async (err, turno) => {
        if (err) {
            res.status(500).send({ message: err });
            console.log(err)
            return;
        }
        ciudad.turno = noturno
        ciudad.pendiente = nores
        ciudad.save()

        info = await Turno.findOne({ _id: turno._id }).populate('ciudad')

        res.status(200).json({
            success: true,
            message: 'Turno agregado con exito',
            data: info
        })
    })

    console.log(body)
}

exports.consulta = async ({ query }, res) => {

    let turno = await Turno.findOne({ curp: query.curp, turno: query.turno })

    if (!turno) {
        return res.status(404).json({
            success: false,
            message: 'No se encontro el turno',
            data: turno
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: turno
    })

};

exports.updateConsulta = async ({ body }, res) => {

    console.log(body)

    let turno = await Turno.findOne({ _id: ObjectId(body._id) })
    console.log(turno)
    if (turno != null) {

        if (body.nombres) turno.nombres = body.nombres;
        if (body.nombre_tramite) turno.nombre_tramite = body.nombre_tramite;
        if (body.materno) turno.materno = body.materno;
        if (body.paterno) turno.paterno = body.paterno;
        if (body.telefono) turno.telefono = body.telefono;
        if (body.celular) turno.celular = body.celular;
        if (body.correo) turno.correo = body.correo;
        if (body.curp) turno.curp = body.curp;
        if (body.ciudad) turno.ciudad = ObjectId(body.ciudad);
        if (body.nivel) turno.nivel = body.nivel;
        if (body.asuntos) turno.asuntos = body.asuntos;


    }

    turno.save().then((turno) => {
        return res.status(200).json({
            success: true,
            message: "Turno actualizado"
        })
    }).catch((err) => {
        console.log("error", err)
        return res.status(400).json({
            success: false,
            message: "Cliente No actualizado"
        })
    })
}

exports.update = async ({ body }, res) => {

    console.log(body)

    let turno = await Turno.findOne({ _id: ObjectId(body._id) })
    console.log(turno)
    if (turno != null) {

        if (body.nombres) turno.nombres = body.nombres;
        if (body.nombre_tramite) turno.nombre_tramite = body.nombre_tramite;
        if (body.materno) turno.materno = body.materno;
        if (body.paterno) turno.paterno = body.paterno;
        if (body.telefono) turno.telefono = body.telefono;
        if (body.celular) turno.celular = body.celular;
        if (body.correo) turno.correo = body.correo;
        if (body.curp) turno.curp = body.curp;
        if (body.ciudad) turno.ciudad = ObjectId(body.ciudad);
        if (body.nivel) turno.nivel = body.nivel;
        if (body.asuntos) turno.asuntos = body.asuntos;
        if (body.estatus) {
            if (body.estatus === turno.estatus) return
            if (body.estatus != turno.estatus) {
                if (turno.estatus == 0 && body.estatus == 1){
                    let ciudad = await Ciudad.findOne({_id: turno.ciudad})
                    ciudad.pendiente = ciudad.pendiente - 1
                    ciudad.resuelto = ciudad.resuelto + 1
                    ciudad.save()
                }
                if (turno.estatus == 1 && body.estatus == 0){
                    let ciudad = await Ciudad.findOne({_id: turno.ciudad})
                    ciudad.pendiente = ciudad.pendiente + 1
                    ciudad.resuelto = ciudad.resuelto - 1
                    ciudad.save()
                }
            }
            turno.estatus = body.estatus;
        }

    }

    turno.save().then((turno) => {
        return res.status(200).json({
            success: true,
            message: "Turno actualizado"
        })
    }).catch((err) => {
        console.log("error", err)
        return res.status(400).json({
            success: false,
            message: "Cliente No actualizado"
        })
    })
}

exports.delete = async ({ query }, response) => {
    console.log(query)
    await Turno.deleteOne({ _id: query.id }).then(function () {
        return response.status(200).json({
            success: true,
            message: 'Turno Eliminado!'
        })
    }).catch(function (error) {
        return response.status(400).json({
            success: false,
            message: handleError(err)
        });
    });

};