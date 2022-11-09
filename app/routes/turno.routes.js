const { authJwt } = require("../middlewares");
const controller = require("../controllers/turno.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/turno/", controller.add);
  app.get("/api/turnos/", controller.list);
  app.put("/api/turnos/update", controller.update);
  app.get("/api/turno/consulta", controller.consulta);
  app.put("/api/turno/consulta/update", controller.updateConsulta);
  app.delete("/api/turno/delete", [authJwt.verificarToken], controller.delete)
  /* app.get("/api/producto/get", [authJwt.verificarToken, authJwt.esAdmin], controller.get);
  app.put("/api/producto/update", [authJwt.verificarToken, authJwt.esAdmin], controller.update); */
  
};