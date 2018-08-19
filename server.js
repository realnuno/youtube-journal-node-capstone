"use strict";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {google} = require('googleapis');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const passport = require("passport");
const config = require('./config');
const { router: mylistRouter } = require("./mylist/mylist-router");
const { router: usersRouter } = require("./users/users-router");
const { localStrategy, jwtStrategy } = require("./auth/auth-strategies");
const { router: authRouter } = require("./auth/auth-router");
const { PORT, DATABASE_URL } = require("./config");


mongoose.Promise = global.Promise;
const app = express();
app.use(morgan("common")); // Logging


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next();
});


app.use(express.static("public"));


passport.use(localStrategy);
passport.use(jwtStrategy);



app.use("/api/users/", usersRouter);
app.use("/api/auth/", authRouter);
app.use("/api/mylist/", mylistRouter);






//----------------------  YouTube endpoint----------------//


const youtube = google.youtube({
    version: 'v3',
    auth: "AIzaSyDxkmLJ32YwnuN4b7vuHfxpGrbZ99edrbE"
});




app.get('/api/search', function (req, res) {


//    console.log(req.params);
    const input = req.query.q;
    const page = req.query.pageToken;

    youtube.search.list({
        type: 'video',
        maxResults: 5,
        part: 'snippet',
        pageToken : page,
        q: input
    }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
//            console.log(data.data.items)
            res.json(data.data)
        }
    });
});







app.use("*", (req, res) => {
    return res.status(404).json({ message: "Not Found" });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                    .on("error", err => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
