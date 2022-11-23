const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Usuario = require("./app/models/usuario.model");
var bcrypt = require("bcryptjs");
const { usuario } = require("./app/models");


const Rol = db.rol
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Se ha conectado a la base de datos");
        initial();
    })
    .catch(err => {
        console.error("Error de conexion", err);
        process.exit();
    });

var corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
//Para procesar solicitudes de tipo JSON
app.use(express.json());
//Para procesar solicitudes con datos codificados de tipo aplication/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//Mensaje predeterminado
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a la API para Turnos." });
});

//Rutas
require('./app/routes/auth.routes')(app);
require('./app/routes/usuario.routes')(app);
require('./app/routes/ciudad.routes')(app);
require('./app/routes/turno.routes')(app);
require('./app/routes/servicios.routes')(app);
require('./app/routes/sugerencia.routes')(app);

// Establecer el puesto de escucha de solicitudes
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando el en siguiente puerto ${PORT}.`);
});

function initial() {
    Rol.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Rol({
                nombre: "usuario"
            }).save(err => {
                if (err) {
                    console.log('error', err)
                }
                console.log("se agregó el rol de 'usuario'");
            });
            new Rol({
                nombre: "administrador"
            }).save(err => {
                if (err) {
                    console.log('error', err)
                }
                console.log("se agregó el rol de 'administrador'");
            });

        }
    })

    Usuario.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Usuario({
                email: "admin@test.com",
                clave: bcrypt.hashSync("123456", 8),
                nombre: "admin",
            }).save((err, user) => {
                if (err) {
                    console.log('error', err)
                }
                Rol.findOne({ nombre: "administrador" }, (err, role) => {
                    user.roles = [role._id];
                    user.save()
                })
                console.log("se agregó el usuario 'admin'");
            })
        }
    })


}
