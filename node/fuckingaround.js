module.exports = function() {

    let rootRequire = require('root-require');
    let CompanyType = rootRequire('node/mongoose/models/companyTypes');
    let SubCompanyType = rootRequire('node/mongoose/models/subCompanyTypes');

    console.log('Started');

    CompanyType.create({
        'name': 'restaurant',
    }, function(err, item) {

        console.log(item);

        SubCompanyType.createWithParent({
            'name': 'chinese',
        }, item._id, function(err, item) {
            if(err) console.log('error!!!');
        });

        SubCompanyType.createWithParent({
            'name': 'italian',
        }, item._id, function(err, item) {
            if(err) console.log('error!!!');
        });

        SubCompanyType.createWithParent({
            'name': 'japanese',
        }, item._id, function(err, item) {
            if(err) console.log('error!!!');
        });

        SubCompanyType.createWithParent({
            'name': 'indian',
        }, item._id, function(err, item) {
            if(err) console.log('error!!!');
        });

    });

    CompanyType.find({}, function(err, items) {
        console.log(items);
    });

};
