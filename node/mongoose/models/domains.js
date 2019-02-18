let mongoose = require('mongoose'),
    rootRequire = require('root-require'),
    globals = require('../globals');
    Schema = mongoose.Schema;

var domainsSchema = schema = new Schema({
    name: {
        type: String,
    },

    scope: {
        active: {
            global: {
                type: Boolean,
                default: false
            },
            companyTypes: [Schema.Types.ObjectId],
            subCompanyTypes: [Schema.Types.ObjectId],
            companies: [Schema.Types.ObjectId]
        },
        inactive: {
            companyTypes: [Schema.Types.ObjectId],
            subCompanyTypes: [Schema.Types.ObjectId],
            companies: [Schema.Types.ObjectId]
        }
    },
}, {
    'collection': 'domains'
});

/**
 * Create domain or overwrite it so that it is added to current scope
 * @param  {obj}      obj Contains properties name: [name of domain], and scope: what scope to add the
 *                        domain to. What company types, sub company types, global? etc. Array of companies/companyTypes _id's.
 *
 * @param  {Function} cb  [callback]
 * @return {[type]}       [description]
 */
schema.statics.createDomain = function(obj, cb) {
    var self = this;

    self.findOne({
        name: obj.name
    }, function(err, item) {
        if(err) return cb(err, null);

        if(item)
        {
            var addToSet = {},
                ids, set;
            ['companyTypes', 'subCompanyTypes', 'companies'].forEach((el) => {
                if(el in obj.scope)
                {
                    ids = obj.scope[el];
                    if(Array.isArray(ids)) {
                        ids = {'$each': ids};
                    }
                    addToSet['scope.active.' + el] = ids;
                }
            });

            /**
             * new: true doesn't work for some reason, so I'm returning the original item pre-update.
             * Doesn't really matter as the only difference is in the scope object.. but something to be careful
             * with.
             */
            item.updateOne({'$addToSet': addToSet}, {new: true}, (err, updatedItem) => {
                if(err) return cb(err, null);
                return cb(null, item);
            });
        }
        else
        {
            var scopeCopy = JSON.parse(JSON.stringify(obj.scope));

            obj.scope.active = scopeCopy;
            Object.keys(obj.scope).forEach(function(key) {
                if(!['active', 'inactive'].includes(key)) delete obj[key];
            });

            self.create(obj, function(err, item) {
                return cb(null, item);
            });
        }
    });
};

/**
 * [description]
 */
schema.statics.getMany = function(scope, cb) {
    /**
     * Get domains that are GLOBAL OR (COMPANY TYPE AND OR SUB COMPANY TYPE)
     * @type {Array}
     */
    var match = globals.matchByScope(scope);

    this.find().aggregate([{'$match': match}], function(err, items) {
        cb(err, items);
    });
};

schema.query.intents = function() {
    return this.lookup({
        'from': 'intents',
        'localField': '_id',
        'foreignField': 'domain',
        'as': 'intents'
    });
};

schema.statics.__getOne = function(domainId, scope) {
    return this.aggregate().match(match).match({'_id': (typeof domainId == 'string') ? mongoose.Types.ObjectId(domainId) : domainId});
};

schema.query.byName = function(name) {
    return this.aggregate({'$match': {'name': name}});
};

schema.query.one = function() {
    return this.match({'_id': (typeof domainId == 'string') ? mongoose.Types.ObjectId(domainId) : domainId});
};

/**
 * [description]
 * @param  {Number} domainId domain id
 * @param  {Object} scope    [optional] scope
 * @return {Domain}
 */
schema.statics.getOne = function(domainId, scope=null) {
    if(!scope)
    {
        var match = globals.matchByScope(scope);
        return this.aggregate().match(match).match({'_id': (typeof domainId == 'string') ? mongoose.Types.ObjectId(domainId) : domainId});
    }
    else
    {
    // this.aggregate([
    //     {
    //         '$match': {
    //             '_id': domainId,
    //             '$or': [
    //                 {'scope.global': true},
    //                 {'scope.company_types': companyTypeId},
    //             ]
    //         }
    //     },
    //     {
    //         '$lookup': {
    //             'from': 'intents',
    //             'localField': '_id',
    //             'foreignField': 'domain',
    //             'as': 'intents'
    //         }
    //     },
    //     {
    //         '$project': {
    //             'scope': 0,
    //             'intents': {
    //                 'scope': 0,
    //                 'domain': 0,
    //             }
    //         }
    //     }
    // ], function(err, items) {
    //     if(err) cb(err, null);
    //
    //     if(items) {
    //         console.log(items);
    //         cb(null, items);
    //     } else {
    //         cb('no items found', null);
    //     }
    // });
    }
}

module.exports = mongoose.model('Domain', domainsSchema);
