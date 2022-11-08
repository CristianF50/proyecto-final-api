const db = require("../models");
const Usuarios = db.usuario;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.list = async ({ query }, res) => {
    const body = query;
    console.log(body)
    let buscar = (body.search == undefined) ? '.*' : body.search + '.*'

    let pipeline = [
        {
            '$sort': { 'nombre': 1 }
        },
    ];

    if (body.search) {
        pipeline.push({
            $match: {
                $and: [
                    {
                        $or: [
                            { nombre: new RegExp(buscar, "i") },
                            { email: new RegExp(buscar, "i") }
                        ]
                    },
                ]
            }
        })
    }

    let usuarios;
    if (body.paginate) {
        usuarios = await Usuarios.find({}).select('-password').sort({ nombre: -1 })
    } else {
        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            select: ['-password'],
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
        };
        usuarios = await Usuarios.aggregatePaginate(Usuarios.aggregate(pipeline), options)
    }
    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: usuarios
    });
};

exports.add = async ({ body }, response) => {


    body.password = bcrypt.hashSync(body.password, 8);

    let user = new Usuarios(body);

    user.save()
        .then(async usuario => {

            return response.status(200).json({
                succes: true,
                message: "Usuario creado exitosamente"
            })
        })
        .catch(error => {

            return response.status(400).json({
                succes: false,
                message: ErrorHandler(error)
            })
        })
};

exports.update = async ({ body, user }, response) => {
    console.log("usuario", body)
    let userReq = user
    Usuarios.findOne({ _id: body._id }).select('-password')
        .then(async (user) => {

            if (user == null) return response.status(404).json({ err, message: '¡Usuario no encontrado!' })

            if (body.nombre !== undefined) user.nombre = body.nombrs;
            if (body.password !== undefined) user.password = bcrypt.hashSync(body.password, 8);
            if (body.email !== undefined) user.email = body.email;

            return response.status(200).json({
                success: true,
                user: user,
                message: 'Usuario Actualizado!'
            })
        })
        .catch(error => {
            console.log(error)
            return response.status(400).json({
                success: false,
                errors: ErrorHandler(error, { capitalize: true, humanize: true }),
                message: '¡Usuario no actualizado!',
            })
        })
};

exports.delete = async ({ query }, response) => {

    await Usuarios.deleteOne({ _id: query.id }).then(function () {
        return response.status(200).json({
            success: true,
            message: '¡Usuario Eliminado!'
        })
    }).catch(function (error) {
        return response.status(400).json({
            success: false,
            message: handleError(err)
        });
    });

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
            message: 'Se ha encontrado el usuario',
            data: usuario[0]
        })
    } else {
        return response.status(400).json({
            success: false,
            message: 'No existe el usuario.',
        })
    }


};