$(document).ready(function () {

    // var id = $(this).parents(".card").data("id");

    $(".create-note").on("click", function (event) {

        var note = $("#note").val();
        var id = $(this).data("id");
        console.log(id, note);

        $.ajax({
            method: "POST",
            url: "/notes/" + id,
            data: {
                // Value taken from note textarea
                body: note
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $(".create-note").empty();
            });
    });

    $(".delete-note").on("click", function (event) {
        var id = $(this).parents(".card").data("id");
        console.log("id: " + id);


        $.ajax("/api/deletenote/" + id, {
            type: "DELETE"
        }).then(function () {
            console.log("Sent to delete route");
        });

        $(this).parents(".card").remove();
    });

});