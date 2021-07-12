const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

const UserModel = require("../models/user.model");
const mongoose = require('mongoose')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/users/getUserRecipes/:id", (req,res)=>{
      const {id} = req.params.id
      UserModel.aggregate([
        {
          $match:{_id:mongoose.Types.ObjectId(req.params.id)}
        },
        {
            $lookup:{
                from: "recipes",
                localField: "_id",
                foreignField: "publisher_id",
                as: "myRecipes"
                
            }
        },
          
      ])
      .then(recipe=>res.json(recipe))
      .catch(err=>res.json(err))
  
  }
  );

};