const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    publisher_id: Schema.Types.ObjectId,
    title:String,
    publisher:String,
    image_url: String,
    ingredients: [],
    howToCook: String,
    votes: Number

  },
  { timestamps: true });
  
  module.exports = mongoose.model("recipe", RecipeSchema);