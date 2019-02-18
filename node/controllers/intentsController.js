let rootRequire = require('root-require'),
    CompanyType = rootRequire('node/mongoose/models/companyTypes'),
    Domain = rootRequire('node/mongoose/models/domains'),
    Intent = rootRequire('node/mongoose/models/intents'),
    TrainingSentence = rootRequire('node/mongoose/models/trainingSentences');

module.exports.list = function(req, res, next) {
    if(!req.session.editAs) {
        req.session.editAs = {
            id: null,
            name: 'global',
            global: true
        };
    }

    CompanyType.getAll(function(err, items) {
        if(err) res.json(err);
        if(!items) res.end('no items');

        res.render('admin/intents/list.html', {
            companyTypes: items
        });
    });
};

module.exports.editAs = function(req, res, next) {
    var editAs = req.body.editAs;
    sesh = req.session.editAs = {};
    if(editAs === 'global') {
        sesh.id = null;
        sesh.name = 'global';
        sesh.global = true;
    } else {
        editAs = editAs.split('---');
        sesh.id = editAs[0];
        sesh.name = editAs[1];
    }

    var source = req.header('Referer') || '/';
    res.redirect(source);
};
