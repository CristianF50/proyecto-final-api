const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;
const config = require("../config/auth.config");
const db = require("../models");
const Turno = db.turno;
const Producto = db.producto;
const Ciudad = db.ciudad;

exports.list = async ({ query }, res) => {

    let body = query
    let buscar = (query.buscar == undefined) ? '.*' : query.buscar + '.*'

    let pipeline = [
        
            {
              '$lookup': {
                'from': 'ciudads', 
                'localField': 'ciudad', 
                'foreignField': '_id', 
                'as': 'ciudad'
              }
            }, {
              '$unwind': {
                'path': '$ciudad'
              }
            },
          
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
        turnos = await Turno.aggregate(pipeline)
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
        turnos = await Turno.aggregatePaginate(Turno.aggregate(pipeline), options)
    }


    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: turnos
    })

};

exports.add = async ({ body }, res) => {

    const ciudad = await Ciudad.findOne({ _id: ObjectId(body.ciudad) })
    console.log(ciudad)

    let noturno = ciudad.turno + 1
    let nores = ciudad.pendiente + 1



    const turno = new Turno({
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