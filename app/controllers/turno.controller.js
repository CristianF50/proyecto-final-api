const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;
const config = require("../config/auth.config");
const db = require("../models");
const Turno = db.turno;
const Producto = db.producto;
const Ciudad = db.ciudad;

exports.list = async ({query}, res) => {

    let body = query
    let buscar = (query.buscar == undefined) ? '.*' : query.buscar + '.*'

    let pipeline = [
        {
            $sort: {fecha: 1}
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
        turnos = await Citas.aggregatePaginate(Citas.aggregate(pipeline), options)
    }


    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: turnos
    })
  
};

exports.add = async ({body}, res) => {

    const ciudad = await Ciudad.findOne({ _id: ObjectId(body.ciudad) })
    console.log(ciudad)

    let noturno = ciudad.turno + 1

    


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