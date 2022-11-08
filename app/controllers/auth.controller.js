const config = require("../config/auth.config");
const db = require("../models");
const Usuario = db.usuario;
const Rol = db.rol;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { usuario } = require("../models");

exports.registro = (req, res) => {
    console.log(req.body)
  const usuario = new Usuario({
    email: req.body.email,
    nombre: req.body.nombre,
    clave: bcrypt.hashSync(req.body.clave, 8)
  });
  usuario.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
        console.log(req.body.body)
      Rol.find(
        {
          nombre: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "El usuario se ha registrado exitosamente!" });
          });
        }
      );
    } else {
      Rol.findOne({ name: "usuario" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        usuario.roles = [role._id];
        usuario.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "El usuario se ha registrado exitosamente!" });
        });
      });
    }
  });
};

exports.iniciarSesion = (req, res) => {
  console.log(req.body);
  Usuario.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, usuario) => {
      console.log(usuario);
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!usuario) {
        return res.status(404).send({ message: "El usuario no se ha encontrado." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        usuario.clave
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "La contraseña es invalida!"
        });
      }
      var token = jwt.sign({ _id: usuario._id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < usuario.roles.length; i++) {
        authorities.push("ROLE_" + usuario.roles[i].nombre.toUpperCase());
      }
      res.status(200).send({
        id: usuario._id,
        username: usuario.usuario,
        nombre: usuario.nombre,
        roles: authorities,
        accessToken: token
      });
    });
};