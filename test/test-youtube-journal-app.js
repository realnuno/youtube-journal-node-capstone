'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
//const should = chai.should();
const expect = chai.expect;


const {
    Mylist
} = require("../mylist/mylist-models");
const {
    router: mylistRouter
} = require("../mylist/mylist-router");
const {
    closeServer,
    runServer,
    app
} = require('../server');
const {
    TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);




describe('youtube journal API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });


    after(function () {
        return closeServer();
    });

    // note the use of nested `describe` blocks.
    // this allows us to make clearer, more discrete tests that focus
    // on proving something small
    describe('GET endpoint', function () {

        it('should return all existing data', function () {
            // strategy:
            //    1. get back all posts returned by by GET request to `/api/mylist`
            //    2. prove res has right status, data type
            //    3. prove the number of posts we got back is equal to number
            //       in db.
            let res;
            return chai.request(app)
                .get('/api/mylist/test')
                .then(_res => {
                    res = _res;
                    expect(res).to.have.status(200);
                    // otherwise our db seeding didn't work
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.be.above(0);

                    return Mylist.count();
                });
        });

        it('should return posts with right fields', function () {
            // Strategy: Get back all posts, and ensure they have expected keys

            let resPost;
            return chai.request(app)
                .get('/api/mylist/test')
                .then(function (res) {
                    res.body.forEach(function (post) {
                        expect(post).to.be.a("object");
                        expect(post).to.have.all.keys('id', 'videoTitle', 'journal', 'video_url', 'creationDate');
                    });
                    // just check one of the posts that its values match with those in db
                    // and we'll assume it's true for rest
                    resPost = res.body[0];
                    return Mylist.findById(resPost.id);
                })
        });
    });








    describe('POST endpoint', function () {
        // strategy: make a POST request with data,
        // then prove that the post we get back has
        // right keys, and that `id` is there (which means
        // the data was inserted into db)
        it('should add a new blog post', function () {

            const newPost = {
                videoTitle: "Lorem ip some",
                journal: "foo foo foo foo",
                video_url: "Emma Goldman"
            };

            const expectedKeys = ["id", "creationDate"].concat(Object.keys(newPost));

            return chai
                .request(app)
                .post('/api/mylist/add-video/test')
                .send(newPost)
                .then(function (res) {
                    console.log("real");
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.have.all.keys(expectedKeys);
                    expect(res.body.videoTitle).to.equal(newPost.videoTitle);
                    expect(res.body.journal).to.equal(newPost.journal);
                    expect(res.body.video_url).to.equal(newPost.video_url);
                })
        });

        it("should error if POST missing expected values", function () {
            const badRequestData = {};
            return chai
                .request(app)
                .post("/api/mylist/add-video/test")
                .send(badRequestData)
                .then(function (res) {
                    expect(res).to.have.status(400);
                });
        });
    });



    describe('PUT endpoint', function () {

        // strategy:
        //  1. Get an existing post from db
        //  2. Make a PUT request to update that post
        //  4. Prove post in db is correctly updated
        it('should update fields you send over', function () {
            return (
                chai
                .request(app)
                // first have to get
                .get('/api/mylist/test')
                .then(function (res) {
                    const updatedPost = Object.assign(res.body[0], {
                        videoTitle: 'cats cats cats',
                        journal: 'dogs dogs dogs'
                    });
                    return chai
                        .request(app)
                        .put(`/api/mylist/edit-journal/test/${res.body[0].id}`)
                        .send(updatedPost)
                        .then(function (res) {
                            expect(res).to.have.status(200);
                        });
                })
            );
        });
    });





    describe('DELETE endpoint', function () {
        it("should delete posts on DELETE", function () {
            return (
                chai
                .request(app)
                // first have to get
                .get("/api/mylist/test")
                .then(function (res) {
                    return chai
                        .request(app)
                        .delete(`/api/mylist/test/${res.body[0].id}`)
                        .then(function (res) {
                            expect(res).to.have.status(204);
                        });
                })
            );
        });
    });
});
