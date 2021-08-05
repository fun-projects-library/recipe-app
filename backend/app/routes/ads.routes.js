const express = require("express");
const ads = require("../controllers/ads.controller.js")
const router = express.Router();

router.get("/", ads.findAll);

router.post("/", ads.create);

router.put("/:id", ads.update);

router.delete("/:id", ads.delete);

router.get("/:id", ads.findOne)


module.exports = router;