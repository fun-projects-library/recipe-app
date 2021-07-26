const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const RecipeSchema = new Schema({
    publisher_id: Schema.Types.ObjectId,
    title:String,
    publisher:String,
    image_url: String,
    ingredients: [],
    howToCook: {type:String, required: true},
    votes: Number,
    category: String,
    voters: [],
    peopleWhoSaved: []


  },
  { timestamps: true });

  RecipeSchema.plugin(mongoosePaginate);
  
  module.exports = mongoose.model("recipe", RecipeSchema);