$(function () {





    //===================== YouTube API =========================




    let query = "";

    $(".search-form").submit(event => {

        event.preventDefault();
        event.stopPropagation();
        //        $('html').animate({
        //            scrollTop: 1250
        //        }, 'fast');



        $('.youtube-search-result').show();

        $('html, body').animate({
            scrollTop: $('.youtube-search-result').offset().top
        }, 1000);

        const queryTarget = $(event.currentTarget).find("#search-input");
        query = queryTarget.val();

        //        queryTarget.val("");

        getResults(query, displayYoutubeData);

    });



    let pageTokenCurrent;

    $(".tokenClass").click(function (event) {

        $('html, body').animate({
            scrollTop: $('.youtube-search-result').offset().top
        }, 1000);

        if ($(event.currentTarget).val() == "Next") {
            pageTokenCurrent = nextPage;

        } else {

            pageTokenCurrent = prevPage;
        };

        $("#search-results p").empty();
        getResults(query, displayYoutubeData);

    });



    function getResults(userInput, callback) {

        const settings = {
            url: "/api/search",
            data: {
                pageToken: pageTokenCurrent,
                q: userInput
            },
            type: "GET",
            dataType: "json",
            success: callback
        };

        $.ajax(settings);

    };


    let videoInfo = [];


    function displayYoutubeData(data) {

        videoInfo = data.items;

        nextPage = data.nextPageToken;
        prevPage = data.prevPageToken;
        console.log(videoInfo);

        data.items.forEach(function (item, index) {


            const videoUrl = `https://www.youtube.com/watch?v=${item.id.videoId}`;

            $(`.video-result${index} img`).prop("src", item.snippet.thumbnails.high.url);
            $(`.video-result${index} img`).prop("alt", item.snippet.title);
            $(`.video-result${index} p`).text(item.snippet.title);
            $(`.video-result${index} button`).attr("data-index", index);
            $(`.video-result${index} a`).prop('hidden', false).attr("href", videoUrl);

        });

        $(".youtube-search-result").prop('hidden', false);
        $(".about-this-app").prop('hidden', true);
    };









    //============== Pick video ============







    let pickedVideo;



    $("#search-results ul").on("click", ".addVideoButton", function (event) {



        event.preventDefault();
        event.stopPropagation();

        const authToken = localStorage.getItem("token");


        pickedVideo = videoInfo[$(this).attr("data-index")];

        localStorage.setItem('storedVideo', JSON.stringify(pickedVideo));



        if (!authToken) {
            $(".main-section").hide();
            $(".login-section").show();
        };
        if (authToken) {

            addPage();

            $('html, body').animate({
                scrollTop: $('.add-main').offset().top
            }, 100);

//            console.log(pickedVideo);

            const embeddedVideo = `
            <div class="row embeddedVideo">
                <div class="col-6">
                    <div class="add-video">
                        <iframe class="ytplayer" type="text/html"
                        src="https://www.youtube.com/embed/${pickedVideo.id.videoId}"
                        frameborder="0" allowfullscreen>
                        </iframe>
                    </div>
                </div>
                <div class="col-6">
                    <div class=" add-joutnal">
                        <textarea rows="4" cols="50" class="journal-textarea"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="col-12 add-button">
                    <button class="button save-button">save</button>
                    </div>
                </div>
            </div>
            `

            $('html, body').animate({
                scrollTop: $('.add-main').offset().top
            }, 2000);

            $(".add-results").html(embeddedVideo);

            //    ----------------------- Add Video ---------------------------


            $(".save-button").click(function (event) {
                event.preventDefault();
                $('html').scrollTop(0);

                let mylist = {
                    videoTitle: pickedVideo.snippet.title,
                    journal: $(".journal-textarea").val(),
                    video_url: pickedVideo.id.videoId
                };

                $.ajax({
                    url: `/api/mylist/add-video`,
                    data: JSON.stringify(mylist),
                    error: function (error) {
                        console.log("error", error);
                    },
                    success: function (data) {
                        mylistPage();
                        //                        console.log(data);

                    },
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json"
                });
            });
        }
    });






    //    ==================  Login Section===================

    let loginUserName;

    $("#login-form").submit(function (event) {
        event.preventDefault();
        $('html').scrollTop(0);

        let logUser = {
            email: $("#login-email-input").val(),
            password: $("#login-password-input").val()
        };



        $.ajax({
            url: `/api/auth/login`,
            data: JSON.stringify(logUser),
            error: function (error) {
                console.log("error", error);
            },
            success: function (data) {


                localStorage.setItem("token", data.authToken);

                console.log(data.authToken);

                let addedVideo;
                if (pickedVideo) {
                    addedVideo = JSON.parse(localStorage.getItem('storedVideo'));
                    //                     console.log(addedVideo);
                };


                if (addedVideo) {

                    addPage();

                    const embeddedVideo = `
                        <div class="row embeddedVideo">
                            <div class="col-6">
                                <div class="add-video">
                                    <iframe class="ytplayer" type="text/html"
                                    src="https://www.youtube.com/embed/${addedVideo.id.videoId}"
                                    frameborder="0" allowfullscreen>
                                    </iframe>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class=" add-joutnal">
                                    <textarea rows="4" cols="50" class="journal-textarea"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="col-12 add-button">
                                    <button class="button save-button">save</button>
                                </div>
                            </div>
                        </div>
                        `


                    $(".add-results").html(embeddedVideo);
                    //                    console.log(JSON.parse(addedVideo));

                    var video = $("#ytplayer").attr("src");
                    $("#ytplayer").attr("src", "");
                    $("#ytplayer").attr("src", video);


                    //    ----------------------- Add Video ---------------------------


                    $(".save-button").click(function (event) {
                        event.preventDefault();
                        $('html').scrollTop(0);


                        let mylist = {
                            videoTitle: pickedVideo.snippet.title,
                            journal: $(".journal-textarea").val(),
                            video_url: pickedVideo.id.videoId
                        };

                        $.ajax({
                            url: `/api/mylist/add-video`,
                            data: JSON.stringify(mylist),
                            error: function (error) {
                                console.log("error", error);
                            },
                            success: function (data) {
                                mylistPage();
                                //                                console.log(data);

                            },
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem("token")
                            },
                            type: "POST",
                            contentType: "application/json",
                            dataType: "json"
                        });
                    });
                }
                if (!addedVideo) {

                    mylistPage();
                }
                //
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



    $(".signup-form").submit(function (event) {
        event.preventDefault();
        $('html').scrollTop(0);

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
            data: JSON.stringify(user),
            error: function (error) {
                alert(error.responseJSON.message);
            },
            success: function (data) {


                $.ajax({
                    url: `/api/auth/login`,
                    data: JSON.stringify(loginUser),
                    error: function (error) {
                        console.log("error", error);
                    },
                    success: function (data) {

                        //                        console.log("logged in!");

                        loginUserName = loginUser.email;
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

    const logOut = function () {

        location.reload();

        localStorage.setItem("token", "");
        localStorage.setItem('storedVideo', "");
        //        searchVideoPage();
        //        const authToken = localStorage.getItem("token");
        //        console.log(authToken);

        $(".main-section").show();
        $(".logged").hide();
        $(".youtube-search-result").hide();
        $(".unlogged").show();
        $(".signup-section").hide();
        $(".login-section").hide();
        $(".add-section").hide();
        $(".mylist-section").hide();


    };


    $("#nav-logout-button1").click(function (event) {
        //        event.preventDefault();
        logOut();
    });
    $("#nav-logout-button2").click(function (event) {
        //        event.preventDefault();
        logOut();
    });
    $("#nav-logout-button3").click(function (event) {
        //        event.preventDefault();
        logOut();
    });


    $("#nav-logout-icon1").click(function (event) {
        //        event.preventDefault();
        logOut();
    });
    $("#nav-logout-icon2").click(function (event) {
        //        event.preventDefault();
        logOut();
    });
    $("#nav-logout-icon3").click(function (event) {
        //        event.preventDefault();
        logOut();
    });




    //    ===================== Nav Buttons jQuery=============


    //    ------------- Search Video ---------


    const searchVideoPage = function () {

        //stop video when it's hidden
        var video = $(".ytplayer").attr("src");
        $(".ytplayer").attr("src", "");
        $(".ytplayer").attr("src", video);

        const addedVideo = localStorage.getItem('storedVideo');

        const authToken = localStorage.getItem("token");

        if (authToken) {

            $(".main-section").show();
            $(".youtube-search-result").hide();
            $(".unlogged").hide();
            $(".logged").show();
            $(".signup-section").hide();
            $(".login-section").hide();
            $(".add-section").hide();
            $(".mylist-section").hide();
        };
        if (!authToken) {
            //            console.log('unlogged');

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

    $("#nav-video-search-button0").click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 'fast');

        searchVideoPage();
    });
    $("#nav-video-search-button1").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-video-search-button2").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-video-search-button3").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-video-search-button4").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-video-search-button5").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });



    $("#nav-icon-search-button0").click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 'fast');

        searchVideoPage();
    });
    $("#nav-icon-search-button1").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-icon-search-button2").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-icon-search-button3").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-icon-search-button4").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });
    $("#nav-icon-search-button5").click(function (e) {
        e.preventDefault();
        $('html').scrollTop(0);

        searchVideoPage();
    });



    //-------------------  Sign Up --------------------

    const signUpPage = function (e) {
        e.preventDefault();

        $(".main-section").hide();
        $(".signup-section").show();
        $(".login-section").hide();
        $(".add-section").hide();
        $(".mylist-section").hide();
    }


    $("#nav-signup-button ").click(e => {
        $('html').scrollTop(0);
        signUpPage(e);
    })

    $("#nav-signup-button2 ").click(e => {
        $('html').scrollTop(0);
        signUpPage(e);
    })


    //    ----------------------- Login ----------------


    const loginPage = function (e) {
        e.preventDefault();

        $(".main-section").hide();
        $(".signup-section").hide();
        $(".login-section").show();
        $(".add-section").hide();
        $(".mylist-section").hide();
    }

    $("#nav-login-button").click(e => {
        $('html').scrollTop(0);
        loginPage(e);
    });

    $("#nav-login-button2").click(e => {
        $('html').scrollTop(0);
        loginPage(e);
    });

    //    -------------------------- Edit ---------------------


    const addedVideo = localStorage.getItem('storedVideo');


    const addPage = function () {
        $(".main-section").hide();
        $(".signup-section").hide();
        $(".login-section").hide();
        $(".add-section").show();
        $(".mylist-section").hide();

        if (addedVideo) {
            //            console.log(JSON.parse(addedVideo));
        };
    }



    //----------------------- My List ---------------------------------------------------
    let mylistData = [];

    const mylistPage = function () {

        var video = $(".ytplayer").attr("src");
        $(".ytplayer").attr("src", "");
        $(".ytplayer").attr("src", video);

        $(".main-section").hide();
        $(".signup-section").hide();
        $(".login-section").hide();
        $(".add-section").hide();
        $(".mylist-section").show();





        const renderResults = function (resultInput, index) {

            return `
            <li>
                <div class="row mylistRow">
                    <div class="col-6">
                        <div class="individualResult">
                        <iframe class="ytplayer" type="text/html"
                        src="https://www.youtube.com/embed/${resultInput.video_url}"
                        frameborder="0" allowfullscreen>
                        </iframe>
                        <p>${resultInput.videoTitle}</p>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="individualJournal">
                            <div class="mylist-joutnal">
                                <p>${resultInput.creationDate}</p>
                                <p>${resultInput.journal}</p>
                            </div>
                        </div>

                    </div>
                    <div class="col-12 mylist-buttons">
                        <button class="button edit-button" video-index="${index}">edit</button>
                        <button class="button delete-button" video-index="${index}">delete</button>
                    </div>
                </div>
                <hr class="divideLine">
            </li>
                    `;

        };



        $.ajax({
            url: "/api/mylist/get-user-list",
            dataType: "json",
            type: "GET",
            success: function (data) {
                //            console.log(data);

                mylistData = data;

                const displayResults = data.map((item, index) => {
                    return renderResults(item, index);
                });

                $(".mylist-results ul").html(displayResults);


            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            error: function (error) {
                console.log(error);
            }
        });
    };



    //-------------------------------- Edit button ------------------------------------

    $(".mylist-results ul").on("click", ".edit-button", function (event) {

        event.preventDefault();
        event.stopPropagation();
        $('html').scrollTop(0);

        var video = $(".ytplayer").attr("src");
        $(".ytplayer").attr("src", "");
        $(".ytplayer").attr("src", video);


        let editJournal = mylistData[$(this).attr("video-index")];
        //        console.log(editJournal);


        addPage();


        const editVideo = `
            <div class="row">
            <div class="col-6">
            <div class="add-video">
            <iframe class="ytplayer" type="text/html"
            src="https://www.youtube.com/embed/${editJournal.video_url}"
            frameborder="0" allowfullscreen>
            </iframe>
            </div>
            </div>
            <div class="col-6">
            <div class=" add-joutnal">
            <textarea rows="4" cols="50" class="journal-textarea"></textarea>
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-12">
            <div class="col-12 add-button">
            <button class="button edit-save-button">save</button>
            </div>
            </div>
            </div>
            `


        $(".add-results").html(editVideo);
        $(".journal-textarea").val(editJournal.journal);





        $(".edit-save-button").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('html').scrollTop(0);


            let editedMylist = {
                journal: $(".journal-textarea").val(),
                id: editJournal.id
            };

            //            console.log(editedMylist);

            $.ajax({
                url: `/api/mylist/edit-journal/${editJournal.id}`,
                data: JSON.stringify(editedMylist),
                error: function (error) {
                    console.log("error", error);
                },
                success: function (data) {
                    //                    console.log("good");
                    mylistPage();

                },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                type: "PUT",
                contentType: "application/json",
                dataType: "json"
            });
        });
    });


    //----------------------------------Delete Button------------------------------------------


    $(".mylist-results ul").on("click", ".delete-button", function (event) {

        event.stopPropagation();
        event.preventDefault();



        let editJournal = mylistData[$(this).attr("video-index")];
        //        console.log(editJournal.id);

        $.ajax({
            url: `/api/mylist/${editJournal.id}`,
            error: function (error) {
                console.log("error", error);
            },
            success: function (data) {
                //                console.log("good");
                mylistPage();

            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            type: "DELETE",
            contentType: "application/json",
            dataType: "json"
        });

    });




    //    ---------------------------- My list Button -----------------------------------


    $("#nav-mylist-button1").click(e => {
        e.preventDefault();
        $('html').scrollTop(0);

        mylistPage(e);
    });
    $("#nav-mylist-button2").click(e => {
        e.preventDefault();
        $('html').scrollTop(0);

        mylistPage(e);
    });
    $("#nav-mylist-button3").click(e => {
        e.preventDefault();
        $('html').scrollTop(0);

        mylistPage(e);
    });



    /****************POPUP ANIMATE*******************/


    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
    });


    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function (item) {
                return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
            }
        }
    });
})
