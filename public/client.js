$(function() {





//===================== YouTube API =========================




    let query="";

    $(".search-form").submit(event => {

        event.preventDefault();
        event.stopPropagation();
        console.log("opop");

        $('.youtube-search-result').show();

        const queryTarget = $(event.currentTarget).find("#search-input");
        query = queryTarget.val();

        queryTarget.val("");

        getResults(query, displayYoutubeData);

    });



    let pageTokenCurrent;

    $(".tokenClass").click(function(event){

        if($(event.currentTarget).val() == "Next"){
            pageTokenCurrent = nextPage;

        } else {

            pageTokenCurrent = prevPage;
        };

        $("#search-results p").empty();
        getResults(query, displayYoutubeData);

    });



    function getResults(userInput, callback){

        const settings = {
            url : "/api/search",
            data : {
                pageToken: pageTokenCurrent,
                q: userInput
            },
            type: "GET",
            dataType : "json",
            success : callback
        };

        $.ajax(settings);

    };
//--------------------------------------------------------------------------------
    let videoInfo = [];


    //--------------------------------------------------------------------------------
    function displayYoutubeData(data){

        videoInfo = data.items;

//        console.log(videoInfo);

        nextPage = data.nextPageToken;
        prevPage = data.prevPageToken;


        const html = data.items.map(function(item, index){

            return renderResult(item, index);

        });

        $(".youtube-search-result").prop('hidden', false);
        $("#search-results ul").html(html);
        $(".about-this-app").prop('hidden', true);
    };



    function renderResult(resultInput, index){

        return `
<li>
<div class="video-result" data-index="${index}">
<a href = "https://www.youtube.com/watch?v=${resultInput.id.videoId}" target = "_blank">
<img src = "${resultInput.snippet.thumbnails.medium.url}" alt="${resultInput.snippet.title}"></a>
<p>${resultInput.snippet.channelTitle}</p>
<button type="submit" class="add-video-button">ADD</button>
</div>
</li>
`
    };




//============== Add video ============




    $("#search-results ul").on("click", ".video-result", function(event) {

        event.preventDefault();
        event.stopPropagation();

        const authToken = localStorage.getItem("token");
        console.log(authToken);

        const pickedVideo = videoInfo[$(this).attr("data-index")];
        localStorage.setItem('storedVideo', JSON.stringify(pickedVideo.snippet));

        if(!authToken){
            $(".main-section").hide();
            $(".login-section").show();
        };
        if(authToken){

            addPage();


            const addedVideo = JSON.parse(localStorage.getItem('storedVideo'));
            console.log(addedVideo);

        }
    });



//    ====================================================================================





//    ==================  Login Section===================


    $("#login-form").submit(function(event) {
        event.preventDefault();

        let logUser = {
            email: $("#login-email-input").val(),
            password: $("#login-password-input").val()
        };

        console.log(logUser);


        $.ajax({
            url: `/api/auth/login`,
            data: JSON.stringify(logUser),
            error: function(error) {
                console.log("error", error);
            },
            success: function(data) {
//                console.log(addedVideo);

                localStorage.setItem("token", data.authToken);

                const addedVideo = localStorage.getItem('storedVideo');

//                const addedVideo = function(){
//                    const res = localStorage.getItem('storedVideo')
//                    if(res){
//                        return JSON.parse(localStorage.getItem('storedVideo'));
//                    }
//                    ;
//                }

                if(addedVideo){

                    addPage();
                    console.log(JSON.parse(addedVideo));
                }
                if(!addedVideo){
                    console.log('no');
                    searchVideoPage();
                }
//                mylistPage();

            },
            // headers: {
            //   'Authorization': 'Bearer ' + authToken
            // },
            type: "POST",
            contentType: "application/json",
            dataType: "json"
        });
    });



//=================== Sign Up Section =======================



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
            url: '/api/users',
            data:  JSON.stringify(user),
            error: function(error) {
                console.log('error', error);
            },
            success: function(data) {

                console.log("signup!");

                $.ajax({
                    url: `/api/auth/login`,
                    data: JSON.stringify(loginUser),
                    error: function(error) {
                        console.log("error", error);
                    },
                    success: function(data) {
                        console.log("logged in!");
                        localStorage.setItem("token", data.authToken);
                        searchVideoPage();
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



//=====================  Log Out Section ====================

    const logOut = function(){



        localStorage.setItem("token", "");
        localStorage.setItem('storedVideo', "");
//        searchVideoPage();
        const authToken = localStorage.getItem("token");
        console.log(authToken);

        $(".main-section").show();
        $(".logged").hide();
        $(".youtube-search-result").hide();
        $(".unlogged").show();
        $(".signup-section").hide();
        $(".login-section").hide();
        $(".add-section").hide();
        $(".mylist-section").hide();
    };


    $("#nav-logout-button1").click(function(event) {
//        event.preventDefault();
        logOut();
    });
    $("#nav-logout-button2").click(function(event) {
//        event.preventDefault();
        logOut();
    });
    $("#nav-logout-button3").click(function(event) {
//        event.preventDefault();
        logOut();
    });





















//    ===================== Nav Buttons jQuery=============


//    ------------- Search Video ---------


    const searchVideoPage = function(){

    const addedVideo = localStorage.getItem('storedVideo');

        const authToken = localStorage.getItem("token");

        if(authToken){

            console.log(authToken);
            $(".main-section").show();
            $(".youtube-search-result").hide();
            $(".unlogged").hide();
            $(".logged").show();
            $(".signup-section").hide();
            $(".login-section").hide();
            $(".add-section").hide();
            $(".mylist-section").hide();
        };
        if(!authToken) {
            console.log('unlogged');

            $(".main-section").show();
            $(".youtube-search-result").hide();
            $(".logged").hide();
            $(".unlogged").show();
            $(".signup-section").hide();
            $(".login-section").hide();
            $(".add-section").hide();
            $(".mylist-section").hide();
        }
    }

    $("#nav-video-search-button0").click(function(e){
        e.preventDefault();

        searchVideoPage();
    });
    $("#nav-video-search-button1").click(function(e){
        e.preventDefault();

        searchVideoPage();
    });
    $("#nav-video-search-button2").click(function(e){
        e.preventDefault();

        searchVideoPage();
    });
    $("#nav-video-search-button3").click(function(e){
        e.preventDefault();

        searchVideoPage();
    });
    $("#nav-video-search-button4").click(function(e){
        e.preventDefault();

        searchVideoPage();
    });
    $("#nav-video-search-button5").click(function(e){
        e.preventDefault();

        searchVideoPage();
    });



//-------------------  Sign Up --------------------

    const signUpPage = function(e){
            e.preventDefault();
            console.log("up");

        $(".main-section").hide();
        $(".signup-section").show();
        $(".login-section").hide();
        $(".add-section").hide();
        $(".mylist-section").hide();
    }


    $("#nav-signup-button ").click( e => {
        signUpPage(e);
    })

    $("#nav-signup-button2 ").click( e => {

        signUpPage(e);
    })


//    ----------------------- Login ----------------


    const loginPage = function(e){
        e.preventDefault();
        console.log("login");

        $(".main-section").hide();
        $(".signup-section").hide();
        $(".login-section").show();
        $(".add-section").hide();
        $(".mylist-section").hide();
    }

    $("#nav-login-button").click(e => {
        loginPage(e);
    });

    $("#nav-login-button2").click(e => {
        loginPage(e);
    });

//    -------------------------- Edit ---------------------
    const addedVideo = localStorage.getItem('storedVideo');


    const addPage = function(){
        $(".main-section").hide();
        $(".signup-section").hide();
        $(".login-section").hide();
        $(".add-section").show();
        $(".mylist-section").hide();

        if(addedVideo){
            console.log(JSON.parse(addedVideo));
        };
    }

    $("#nav-edit-button").click(e => {

        e.preventDefault();
        console.log("edit");
        addPage(e);

    });

    $("#nav-edit-button2").click(e => {

        e.preventDefault();
        console.log("edit");
        addPage(e);
    });

    $("#nav-edit-button3").click(e => {

        e.preventDefault();
        console.log("edit");
        addPage(e);
    });


//----------------------- My List -------------------


    const mylistPage = function(){

        $(".main-section").hide();
        $(".signup-section").hide();
        $(".login-section").hide();
        $(".add-section").hide();
        $(".mylist-section").show();
    };

    $("#nav-mylist-button1").click(e => {
        e.preventDefault();
        console.log("mylist");

        mylistPage(e);
    });
    $("#nav-mylist-button2").click(e => {
        e.preventDefault();
        console.log("mylist");

        mylistPage(e);
    });
    $("#nav-mylist-button3").click(e => {
        e.preventDefault();
        console.log("mylist");

        mylistPage(e);
    });











})
