$(document).ready(function () {



    $('.dropdown-content a').click(function (e) {
        var buttonClicked = $(this).html();
        $($(this).parent().siblings()[0]).html(buttonClicked);
    });
});
