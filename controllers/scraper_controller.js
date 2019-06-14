var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

// Require all models
var db = require("../models");


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/savedarticles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.render("savedarticles", { articles: dbArticle });
            // res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

    // res.render("savedarticles");
});

router.get("/notes/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            console.log(dbArticle)
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.render("savednotes", { articles: dbArticle });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/notes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.render("savednotes", { articles: dbArticle });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.post("/api/savearticle", function (req, res) {
    db.Article.create(req.body)
        .then(function (dbArticle) {
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
});

router.delete("/api/deletearticle/:id", function (req, res) {
    db.Article.deleteOne({ _id: req.params.id })
        .then(function (dbArticle) {
            console.log("removed:", dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
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

        res.render("index", { articles: result });
    });
});

// Export routes for server.js to use.
module.exports = router;
