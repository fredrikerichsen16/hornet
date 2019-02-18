let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let intentsSchema = schema = new Schema({
    domain: {
        type: Schema.Types.ObjectId,
        ref: 'Domain'
    },

    name: {
        type: String
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
    collection: 'intents'
});

/**
 * [description]
 * @param  {[type]}   obj [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
schema.statics.createIntent = function(obj, cb) {
    var self = this;

    this.findOne({
        name: obj.name,
        domain: obj.domain
    }, function(err, item) {
        if(err) return cb(err, null);

        if(item) {
            var addToSet = {},
                ids;
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

            item.update({$addToSet: addToSet}, {new: true}, function(err, updatedItem) {
                if(err) return cb(err, null);
                return cb(null, item);
            });
        } else {
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

module.exports = mongoose.model('Intent', intentsSchema);
