const { authJwt } = require("../middlewares");
const controller = require("../controllers/sugerencias.controller");
module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get     ("/api/sugerencia",                  [authJwt.verificarToken], controller.list);
  app.get     ("/api/sugerencia/get",              [authJwt.verificarToken], controller.get);
  app.post    ('/api/sugerencia/add',               controller.add)
  app.put     ('/api/sugerencia/update',           [authJwt.verificarToken], controller.update)
  app.delete  ('/api/sugerencia/delete',           [authJwt.verificarToken], controller.delete)
  
};