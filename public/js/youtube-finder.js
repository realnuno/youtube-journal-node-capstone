

$(function (){


    let query="";

    $(".search-form").submit(event => {

        event.preventDefault();
        event.stopPropagation();

        $('.youtube-search-result').show();

        const queryTarget = $(event.currentTarget).find("#search-input");
        query = queryTarget.val();

        queryTarget.val("");

        getResults(query, displayYoutubeData);


//        $("#search-results p").empty();

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
            url : "https://www.googleapis.com/youtube/v3/search",
            data : {
                part: "snippet",
                maxResults: 5,
                key: "AIzaSyDxkmLJ32YwnuN4b7vuHfxpGrbZ99edrbE",
                q: userInput,
                pageToken: pageTokenCurrent
            },
            type: "GET",
            dataType : "json",
            success : callback
        };

        $.ajax(settings);

    };




    function displayYoutubeData(data){


        nextPage = data.nextPageToken;
        prevPage = data.prevPageToken;


        const html = data.items.map(function(item, index){

            //            console.log(data);

            return renderResult(item);

        });

        $(".youtube-search-result").prop('hidden', false);
        $("#search-results ul").html(html);
        $(".about-this-app").prop('hidden', true);

    };



    function renderResult(resultInput){

        return `
    <li>
        <a href = "https://www.youtube.com/watch?v=${resultInput.id.videoId}" target = "_blank">
        <img src = "${resultInput.snippet.thumbnails.medium.url}" alt="${resultInput.snippet.title}"></a>
        <p>${resultInput.snippet.channelTitle}</p>
        <button type="submit" class="add-video">ADD</button>
    </li>
    `
    };



});

