"use strict";
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/chatbot', {useNewUrlParser: true });
    let db = mongoose.connection;
    // db.once('open', function () {
    //     console.log('Connected to MongoDB');
    // });
    // db.on('error', function (err) {
    //     console.log(err);
    // });
};
