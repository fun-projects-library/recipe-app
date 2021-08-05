const mongoose = require("mongoose");

const Advertisement = mongoose.model(
  "Advertisement",
  new mongoose.Schema({
    fullName: String,
    email: String,
    companyName: String,
    companySector: String,
    applicantPosition: String,
    budget: Number,
    responded: Boolean,
    notes: String
  },
  { timestamps: true })
);

module.exports = Advertisement;