const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/usuario", [authJwt.verificarToken], controller.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verificarToken, authJwt.esAdmin],
    controller.adminBoard
  );

  app.get     ("/api/usuarios",              [authJwt.verificarToken], controller.list);
  app.get     ("/api/usuarios/get",              [authJwt.verificarToken], controller.get);
  app.post    ('/api/usuarios/add',              [authJwt.verificarToken], controller.add)
  app.put     ('/api/usuarios/update',           [authJwt.verificarToken], controller.update)
  app.delete     ('/api/usuarios/delete',        [authJwt.verificarToken], controller.delete)
};