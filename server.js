const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Usuario = require("./app/models/usuario.model");
var bcrypt = require("bcryptjs");
const { usuario } = require("./app/models");
const Ciudad = require("./app/models/ciudad.model");

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
    origin: "http://localhost:8081"
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
require('./app/routes/producto.routes')(app);
require('./app/routes/transaccion.routes')(app);

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

    Ciudad.estimatedDocumentCount((err, count) => {
        if (!err && count === 0 ) {
            new Ciudad({
                nombre:"Abasolo"
            }).save()
            new Ciudad({
                nombre:"Acuña"
            }).save()
            new Ciudad({
                nombre:"Allende"
            }).save()
            new Ciudad({
                nombre:"Arteaga"
            }).save()
            new Ciudad({
                nombre:"Candela"
            }).save()
            new Ciudad({
                nombre:"Castaños"
            }).save()
            new Ciudad({
                nombre:"Cuatro Ciénegas"
            }).save()
            new Ciudad({
                nombre:"Escobedo"
            }).save()
            new Ciudad({
                nombre:"Francisco I. Madero"
            }).save()
            new Ciudad({
                nombre:"Frontera"
            }).save()
            new Ciudad({
                nombre:"General Cepeda"
            }).save()
            new Ciudad({
                nombre:"Guerrero"
            }).save()
            new Ciudad({
                nombre:"Hidalgo"
            }).save()
            new Ciudad({
                nombre:"Jiménez"
            }).save()
            new Ciudad({
                nombre:"Juárez"
            }).save()
            new Ciudad({
                nombre:"Lamadrid"
            }).save()
            new Ciudad({
                nombre:"Matamoros"
            }).save()
            new Ciudad({
                nombre:"Monclova"
            }).save()
            new Ciudad({
                nombre:"Morelos"
            }).save()
            new Ciudad({
                nombre:"Múzquiz"
            }).save()
            new Ciudad({
                nombre:"Nadadores"
            }).save()
            new Ciudad({
                nombre:"Nava"
            }).save()
            new Ciudad({
                nombre:"Ocampo"
            }).save()
            new Ciudad({
                nombre:"Parras"
            }).save()
            new Ciudad({
                nombre:"Piedras Negras"
            }).save()
            new Ciudad({
                nombre:"Progreso"
            }).save()
            new Ciudad({
                nombre:"Ramos Arizpe"
            }).save()
            new Ciudad({
                nombre:"Sabinas"
            }).save()
            new Ciudad({
                nombre:"Sacramento"
            }).save()
            new Ciudad({
                nombre:"Saltillo"
            }).save()
            new Ciudad({
                nombre:"San Buenaventura"
            }).save()
            new Ciudad({
                nombre:"San Juan de Sabinas"
            }).save()
            new Ciudad({
                nombre:"San Pedro"
            }).save()
            new Ciudad({
                nombre:"Sierra Mojada"
            }).save()
            new Ciudad({
                nombre:"Torreón"
            }).save()
            new Ciudad({
                nombre:"Viesca"
            }).save()
            new Ciudad({
                nombre:"Villa Unión"
            }).save()
            new Ciudad({
                nombre:"Zaragoza"
            }).save().then(() => {
                console.log("se agregaron las ciudades")
            })
        }
    })

}
