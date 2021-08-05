const db = require("../models");
const Ads = db.Advertisement;

exports.create = (req,res) => {
    if(!req.body){
        res.status(404).send({message: "Content cannot be empty"});
    }
    
    const advertise = new Ads(req.body)
    
    advertise.save()
    .then(data=>{
        res.send(data)
    })
    .catch(err=>{
        res.status(500).send({
        message:
        err.message || "Error occurred while creating ad!"})
    })

}

exports.findAll = (req,res)=>{
    const condition = {}
    Ads.find(condition)
    .then(data=>{
        res.send(data)
    })
    .catch(err=>{
        res.status(500).send({
            message: 
            err.message || "Some error while retrieving the ads!"
        })
    })
}

exports.update = (req,res) =>{
    const id = req.params.id;
    Ads.findByIdAndUpdate(id, req.body, {new: true, useFindAndModify: false})
    .then(data=>{
        if(!data){
            res.status(404).send({
                message: `Cannot update Ad with id=${id}. Maybe Ad was not found.`
            })
        } else {
            res.send(data)
        }
    })
    .catch(err => {
        res.status(500).send({
          message: 
          err.message || "Error updating Ad with id=" + id
        });
    });
}


exports.delete = (req,res) => {
    const id = req.params.id;
    Ads.findByIdAndRemove(id,{useFindAndModify: false})
    .then(data=>{
        if(!data){
            res.status(404).send({
                message: `Cannot delete the Ad with id= ${id}. Maybe Ad was not found!`
            })
        } else {res.send({ message: "Ad was deleted successfully." })}
    })
    .catch(err=>{
        res.status(500).send({
            message: "Error deleting Ad with id=" + id
          });
    })
}

// Find a single Todo Item with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Ads.findById(id)
    .then(data=>{
        if(!data){
            res.status(404).send({
                message: `Error occurred while finding ad with id= ${id}.`
            })
        } else {res.send(data)}
    })
    .catch(err=>{
        res.status(500).send({
            message: 
            err.message || "Cannot access the ad"
        })
    })
};