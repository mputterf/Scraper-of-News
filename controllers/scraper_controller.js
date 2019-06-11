var express = require("express");

var router = express.Router();

// Require all models
var db = require("./models");


router.get("/", function (req, res) {
    res.render("index");
});


// Export routes for server.js to use.
module.exports = router;
