const pgRoute = require("express").Router();


const controller = require("./pgauth.controller")

pgRoute.post("/users", controller.create);
pgRoute.get("/users", controller.getAll);


module.exports = pgRoute;