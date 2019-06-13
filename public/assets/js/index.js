$(document).ready(function () {

    $(".article-save").on("click", function (event) {
        var title = $(this).parents(".card").find(".card-title").text();
        var link = $(this).parents(".card").find(".article-link").attr("href");
        var thumbnail = $(this).parents(".card").find("img").attr("src");

        console.log("title: " + title + " link: " + link + " thumbnail: " + thumbnail)

        var article = {
            title: title,
            link: link,
            thumbnail: thumbnail
        }

        $.post("api/savearticle", article, function () {
            console.log("Sent to post route")
        });


        $(this).replaceWith("<p>Saved!</p>");
    });
});