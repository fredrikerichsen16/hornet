const mongoose = require('mongoose');

module.exports.matchByScope = function(scope) {
    var or = [];
    if(scope.global) {
        or.push({'scope.active.global': true});
    }

    var scopes = ['companyTypes', 'subCompanyTypes', 'companies'];

    scopes.forEach(function(s) {
        if(scope[s]) {
            var and = [{}, {}];
            var _id = mongoose.Types.ObjectId(scope[s]);

            and[0][`scope.active.${s}`] = _id;
            and[1][`scope.inactive.${s}`] = {'$ne': _id};

            or.push({'$and': and});
        }
    });

    var match = {
        '$or': or
    };

    return match;
}
