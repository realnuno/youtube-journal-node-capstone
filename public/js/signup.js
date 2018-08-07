$(function() {
    setFormListener()
});

function setFormListener(){

    $(".signup-form").submit(function(event){
        event.preventDefault();

        let user = {
            name: $("#name-input").val(),
            email: $("#email-input").val(),
            password: $("#password-input").val()
        };

        let loginUser = {
            email: $("#email-input").val(),
            password: $("#password-input").val()
        };

//        console.log(user);

        $.ajax({
            url: 'http://localhost:8080/api/users',
            data:  JSON.stringify(user),
            error: function(error) {
                console.log('error', error);
            },
            success: function(data) {
//                console.log(data);
                $.ajax({
                    url: `http://localhost:8080/api/auth/login`,
                    data: JSON.stringify(loginUser),
                    error: function(error) {
                        console.log("error", error);
                    },
                    success: function(data) {
                        console.log(data);
                        sessionStorage.setItem("token", data.authToken);
                                        location.replace("./mylist.html");
                    },
                    // headers: {
                    //   'Authorization': 'Bearer ' + authToken
                    // },
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json"
                });
//                location.replace('./mylist.html');
            },
            // headers: {
            //   'Authorization': 'Bearer ' + authToken
            // },
            type: 'POST',
            contentType: 'application/json',
            dataType: "json",
        });

    })
}
