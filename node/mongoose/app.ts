module.exports = function() {

    var mongoose = require('mongoose');

    mongoose.connect('mongodb://127.0.0.1/chatbot');
    let db = mongoose.connection;

    db.once('open', function() {
        console.log('Connected to MongoDB');
    });

    db.on('error', function(err : any) {
        console.log(err);
    });

};
