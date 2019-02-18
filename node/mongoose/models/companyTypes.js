let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    slug = require('mongoose-slug-generator'),
    rootRequire = require('root-require'),
    SubCompanyType = rootRequire('node/mongoose/models/subCompanyTypes');;

mongoose.plugin(slug, {
    'truncate': 40
});

let companyTypesSchema = schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        slug: 'name'
    },
    parent: {
        type: Schema.Types.ObjectId,
    }
}, {
    collection: 'companyTypes'
});

/**
 * Get all company types and subtypes in this format:
 * { name, slug, subtypes: [{name, slug}] }
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
schema.statics.getAll = function(cb) {
    this.aggregate(
        [
            {
                '$lookup': {
                    'from': 'companyTypes',
                    'localField': '_id',
                    'foreignField': 'parent',
                    'as': 'subtypes'
                }
            },
            {
                '$match': {
                    'parent': null
                }
            },
            {
                '$project': {
                    '_id': 1,
                    'name': 1,
                    'slug': 1,
                    'subtypes': {
                        'name': 1,
                        'slug': 1,
                    }
                }
            }
        ]
    ).exec(function(err, items) {
        if (err) cb(err, null);

        if(items) cb(null, items);
        else cb('not found', items);
    });
};

/**
 * Create a sub company type (of the current company type)
 * @eg CompanyType.findOne({'name': 'hotel'}, (err, item) {
 * !       item.createSubType({'name': 'resort'}, ..callback);
 *     });
 * @param  {[type]}   obj [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
schema.methods.createSubType = function(obj, cb) {
    var self = this;

    obj.parent = this._id;

    self.model('CompanyType').create(obj, function(err, item) {
        if (err) cb(err, null);

        if(item) cb(null, item);
        else cb('not found', item);
    });
};

schema.query.subs = function(cb) {
    return this.model('CompanyType').where({'parent': this._id}).find();
}

module.exports = mongoose.model('CompanyType', companyTypesSchema);
