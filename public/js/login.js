$(function() {
    setFormListener();
});

function setFormListener() {
    $("#login-form").submit(function(event) {
        event.preventDefault();

        let user = {
            email: $("#email-input").val(),
            password: $("#password-input").val()
        };

        console.log(user);

        $.ajax({
            url: `http://localhost:8080/api/auth/login`,
            data: JSON.stringify(user),
            error: function(error) {
                console.log("error", error);
            },
            success: function(data) {
                console.log(data);
                sessionStorage.setItem("token", data.authToken);
//                location.replace("./mylist.html");
            },
            // headers: {
            //   'Authorization': 'Bearer ' + authToken
            // },
            type: "POST",
            contentType: "application/json",
            dataType: "json"
        });
    });
}
