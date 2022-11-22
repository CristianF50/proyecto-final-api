const { authJwt } = require("../middlewares");
const controller = require("../controllers/servicios.controller");
module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get     ("/api/servicios/landing",                                    controller.landing);
  app.get     ("/api/servicios",                  [authJwt.verificarToken], controller.list);
  app.get     ("/api/servicios/get",              [authJwt.verificarToken], controller.get);
  /*app.post    ('/api/servicios/add',              [authJwt.verificarToken], controller.add)
  app.put     ('/api/servicios/update',           [authJwt.verificarToken], controller.update)
  app.delete  ('/api/servicios/delete',           [authJwt.verificarToken], controller.delete) */
  
};