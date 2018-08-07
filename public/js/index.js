$(function() {

    $("#signup-button").click(function(e) {
        e.preventDefault();

        console.log("real");
        $.ajax({
            url: 'signup.html',
            success: function(data) {
                console.log("real");
                location.replace("signup.html");
                $('#real').text('real');
                alert('Load was performed.');
            }
        });

    });

    $(".login-button").click(function(e){
        e.preventDefault();
        $('#real').text('real');
    });



})
