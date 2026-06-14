const routerConfig =require("express").Router()
const authRoute=require("../modules/auth/auth.router");
const pgAuthRoute = require("../modules/pgauth/pg.router")

routerConfig.use("/auth",authRoute)
routerConfig.use("/pgauth",pgAuthRoute)
module.exports=routerConfig;