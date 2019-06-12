var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

// Require all models
var db = require("../models");


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/scrape", function (req, res) {
    var url = "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en"
    // var url = "http://www.echojs.com/"
    // Grab the html with axio
    axios.get(url).then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        var result = [];
        // console.log($)
        //xrnccd appears to be the class name of the div that contains the article and thumbnail
        // the article name and link are separate from the thumbnail
        $(".xrnccd").each(function (i, element) {
            // Save an empty result object


            // Add the text and href of every link, and save them as properties of the result object
            var title = $(element)
                .find("article")
                .children("h3")
                .children("a")
                .text();
            var link = $(element)
                .find("article")
                .children("h3")
                .find("a")
                .attr("href");
            var thumbnail = $(element)
                .find("a")
                .children("figure")
                .find("img")
                .attr("src")

            // console.log(element)
            // console.log(thumbnail)
            // Links are just everything after .com, so we'll put https://news.google.com in front for a working line
            result.push({
                title: title,
                link: link.replace(/^\.+/, 'https://news.google.com'),
                thumbnail: thumbnail
            })

            // Send a message to the client

        });

        res.json(result);
    });
});

// Export routes for server.js to use.
module.exports = router;
