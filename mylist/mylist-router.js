"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const {
    Mylist
} = require("./mylist-models");
const {
    User
} = require("../users/users-router");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
const jsonParser = bodyParser.json();
const localAuth = passport.authenticate("local", {
    session: false
});
const jwtAuth = passport.authenticate('jwt', {
    session: false
});


router.get("/", jwtAuth, (req, res) => {

    Mylist.find()
        .populate("user")
        .sort({
            creationDate: -1
        })
        .then(mylists => {
            res.json(
                mylists.map(mylist => mylist.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});

router.get("/test", (req, res) => {

    Mylist.find()
        .populate("user")
        .sort({
            creationDate: -1
        })
        .then(mylists => {
            res.json(
                mylists.map(mylist => mylist.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});



router.get("/get-user-list/", jwtAuth, (req, res) => {

    Mylist.find({
            user: req.user.id
        })
        .sort({
            creationDate: -1
        })
        .then(mylists => {
            res.json(
                mylists.map(mylist => mylist.serialize())
            );
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});



router.get("/:id", (req, res) => {
    Mylist.findById(req.params.id)
        .populate("user")
        .then(mylist => res.json(mylist.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "something went wrong"
            });
        });
});

router.post("/add-video", jwtAuth, jsonParser, (req, res) => {

    //change to actual fields//
    const requiredFields = [
        "videoTitle",
        "journal",
        "video_url"
    ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }



    Mylist.create({
            videoTitle: req.body.videoTitle,
            journal: req.body.journal,
            video_url: req.body.video_url,
            user: req.user.id
        })
        .then(
            mylist => res.status(201).json(mylist.serialize())
        )
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "Something went wrong"
            });
        });
});


router.post("/add-video/test/", jsonParser, (req, res) => {

    //change to actual fields//
    const requiredFields = [
        "videoTitle",
        "journal",
        "video_url"
    ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = Mylist.create({
            videoTitle: req.body.videoTitle,
            journal: req.body.journal,
            video_url: req.body.video_url
        })
        .then(
            mylist => res.status(201).json(mylist.serialize())
        )
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: "Something went wrong"
            });
        });
});









router.put("/edit-journal/:id", jwtAuth, jsonParser, (req, res) => {


    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: "Request path id and request body id values must match"
        });
    }

    const updated = {};
    //change to actual fields//
    const updateableFields = [
        "journal",
        "id"
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });


    Mylist.findByIdAndUpdate(
            req.params.id, {
                $set: updated
            }, {
                new: true
            }
        )
        .then(updatedMylist => res.json(updatedMylist))
        .catch(err => res.status(500).json({
            message: "Something went wrong"
        }));
});



router.put("/edit-journal/test/:id", jsonParser, (req, res) => {


    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: "Request path id and request body id values must match"
        });
    }

    const updated = {};
    //change to actual fields//
    const updateableFields = [
        "journal",
        "id"
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });


    Mylist.findByIdAndUpdate(
            req.params.id, {
                $set: updated
            }, {
                new: true
            }
        )
        .then(updatedMylist => res.json(updatedMylist))
        .catch(err => res.status(500).json({
            message: "Something went wrong"
        }));
});





router.delete('/:id', jwtAuth, function (req, res) {
    Mylist.findByIdAndRemove(req.params.id).then(function (entry) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});


router.delete('/test/:id', function (req, res) {
    Mylist.findByIdAndRemove(req.params.id).then(function (entry) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});




module.exports = {
    router
};
