const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");


const UserModel = require("../models/user.model");
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
	try {
		const { page = 1 } = req.query;

    function arrayUnique(array) {
      var a = array.concat();
      for(var i=0; i<a.length; ++i) {
          for(var j=i+1; j<a.length; ++j) {
              if(a[i].title === a[j].title)
                  a.splice(j--, 1);
          }
      }
      return a;
  }
    // const searchTitle = { title: { $regex: new RegExp(req.body.query.title), $options: "i" } };
    // const searchCategory ={ category: { $regex: new RegExp(req.body.query.category), $options: "i" } }
    // const searchPublisher ={ publisher: { $regex: new RegExp(req.body.query.publisher), $options: "i" } } 

    const response = await UserModel.find()
    // const response2 = await UserModel.find()
    // const response3 = await UserModel.find()
  
		// const response = await arrayUnique(response1.concat(response2.concat(response3)))
      
		const pages = 1 ;
		res.json({
      totalUsers: response.length,
      users: response,
      totalPages: pages,
      currentPage: page - 1,
		});
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};


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

  app.post("/api/user/allUsers", getAllUsers);

};

