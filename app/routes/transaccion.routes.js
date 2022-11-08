const { authJwt } = require("../middlewares");
const controller = require("../controllers/transaccion.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/transaccion/add", [authJwt.verificarToken], controller.add);
  app.get("/api/transaccion/list", [authJwt.verificarToken], controller.list);
  /* app.get("/api/producto/get", [authJwt.verificarToken, authJwt.esAdmin], controller.get);
  app.put("/api/producto/update", [authJwt.verificarToken, authJwt.esAdmin], controller.update); */
  
};