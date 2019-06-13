$(document).ready(function () {

    $(".delete-article").on("click", function (event) {
        var id = $(this).parents(".card").data("id");
        console.log("id: " + id);


        $.ajax("api/deletearticle/" + id, {
            type: "DELETE"
        }).then(function () {
            console.log("Sent to delete route");
        });

        $(this).parents(".card").remove();
    });
});