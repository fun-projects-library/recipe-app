var express = require("express");
var router = express.Router();

// Model
const db = require("../models");
const RecipeModel = db.RecipeModel;


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

router.get('/paginatedRecipes', (req, res) => {
  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  const { limit, offset } = getPagination(page, size);

  RecipeModel.paginate(condition,{ offset, limit })
    .then((data) => {
      res.send({
        totalRecipes: data.totalDocs,
        recipes: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

const getWithQuery = async (req, res) => {
	try {
    //console.log(req.body.title)
		
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


    const searchTitle = { title: { $regex: new RegExp(req.body.query.title), $options: "i" } };
    const searchCategory ={ category: { $regex: new RegExp(req.body.query.category), $options: "i" } }
    const searchPublisher ={ publisher: { $regex: new RegExp(req.body.query.publisher), $options: "i" } } 
    const response1 = await RecipeModel.find(searchTitle)
    const response2 = await RecipeModel.find(searchCategory)
    const response3 = await RecipeModel.find(searchPublisher)
  
		const response = await arrayUnique(response1.concat(response2.concat(response3)))
      
		const pages = 1 ;
		res.json({
      totalRecipes: response.length,
      recipes: response,
      totalPages: pages,
      currentPage: page - 1,
		});
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};
router.post('/filteredRecipes', getWithQuery)

// GET request with node-express-get snippet
router.get('/', (req, res) => {
    // res.send('GET request to the homepage !!!!')
    RecipeModel.find()
    .then((recipe)=>{res.json(recipe)})
    .catch((error)=>{res.json(error)})
  })


router.get("/getUserRecipes", (req,res)=>{

    RecipeModel.aggregate([
        
        {
            $lookup:{
                from: "users",
                localField: "publisher_id",
                foreignField: "_id",
                as: "myRecipes"
                
            }
        },
        
    ])
    .then(recipe=>res.json(recipe))
    .catch(err=>res.json(err))

})
  
  //Get details of a recipe api/recipes/:recipeId
  router.get('/:recipeId',(req,res)=>{
    RecipeModel.findById(req.params.recipeId)
    .then((recipe)=>{res.json(recipe)})
    .catch((error)=>{res.json(error)})
  })
  
  
  // POST request to save recipes in the db
  router.post('/',(req, res, next)=>{
    const newrecipe = new RecipeModel(req.body)
    newrecipe.save()
    .then((recipe)=>{res.json(recipe)})
    .catch((error)=>{next({message:error})
    /*res.json(error)*/})
  })
  
  //update a recipe with new info api/recipes/:recipeId
  router.put('/:recipeId', (req, res, next) => {
    RecipeModel.findByIdAndUpdate(req.params.recipeId, req.body, {new:true})
    .then((recipe)=>{res.json(recipe)})
    .catch((error)=>{res.json(error)})
  })
  
  ///delete recipe by id api/recipes/:recipeId
  router.delete('/:recipeId', (req, res, next) => {
    RecipeModel.findByIdAndRemove(req.params.recipeId)
    .then((recipe)=>{res.json(recipe)})
    .catch((error)=>{res.json(error)})
  })
  
  // Export the route
  module.exports = router