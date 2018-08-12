"use strict";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

function timeStamp(now) {
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    var time = [now.getHours(), now.getMinutes()];
    var suffix = time[0] < 12 ? "AM" : "PM";
    time[0] = time[0] < 12 ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return date.join("/") + " " + time.join(":") + " " + suffix;
}

const mylistSchema = mongoose.Schema({
    videoTitle: {
        type: String,
        required: true
    },
    journal: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    video_url: {
        type: String,
        default: ""
    },
    creationDate: {
        type: Date,
        default: new Date()
    }
});


mylistSchema.methods.serialize = function() {
    return {
        videoTitle: this.videoTitle || "",
        journal: this.journal || "",
        id: this._id || "",
        video_url: this.video_url,
        creationDate: timeStamp(this.creationDate)
    };
};

const Mylist = mongoose.model("Mylist", mylistSchema);

module.exports = { Mylist };
