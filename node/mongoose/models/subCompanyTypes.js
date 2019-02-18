let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    slug = require('mongoose-slug-generator'),
    rootRequire = require('root-require'),
    CompanyType = rootRequire('node/mongoose/models/companyTypes');;

mongoose.plugin(slug, {
    'truncate': 40
});

let subCompanyTypesSchema = schema = new Schema({
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
        ref: 'CompanyType'
    }
}, {
    collection: 'subCompanyTypes'
});

/**
 * Get parent company type document
 * E.g. SubCompanyType.findOne(...).getParent(['name', '_id'], callback))
 *
 * @param  {[type]}   fields [specify fields in the parent document to retrieve]
 * @param  {Function} cb     [callback]
 * @return {Function}        [callback]
 */
schema.query.getParent = function(cb, fields=[]) {
    this.populate('parent', ...fields).exec(function(err, item) {
        if(err) cb(err, null);

        cb(err, item.parent);
    });
};

schema.statics.populate = async function() {
    var CT = new CompanyType({name: 'hotel'});
    var sub1  = await this.create({name: 'motel', parent: CT._id});
    var sub2 = await this.create({name: 'resort', parent: CT._id});

    CT.sub.push(sub1._id);
    CT.sub.push(sub2._id);

    await CT.save();


    var CT = new CompanyType({name: 'restaurant'});
    var sub1  = await this.create({name: 'chinese-restaurant', parent: CT._id});
    var sub2 = await this.create({name: 'indian-restaurant', parent: CT._id});

    CT.sub.push(sub1._id);
    CT.sub.push(sub2._id);

    await CT.save();

    var CT = new CompanyType({name: 'airline'});
    var sub1  = await this.create({name: 'airline-general', parent: CT._id});
    var sub2 = await this.create({name: 'klm', parent: CT._id});

    CT.sub.push(sub1._id);
    CT.sub.push(sub2._id);

    await CT.save();

    return 'done';
};

/**
 * Create a new sub company type and associate it with a parent company type (whose ID is known and provided)
 * @param  {[type]}   obj      [sub company type db info]
 * @param  {[type]}   parentId [parent company type _id]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
schema.statics._create = function(obj, parentId, cb) {
    obj.parent = parentId;

    this.create(obj, function(err, sub) {
        if(err) return cb(err, null);

        CompanyType.findByIdAndUpdate(parentId, {'$push': {'sub': sub._id}}, function(err, parent) {
            return cb(err, sub);
        });
    });
};

/**
 * Delete one or more sub company types, then pull the _id from the parent company type's 'sub' array.
 * Basically delete the sub company type and disband the relation
 *
 * @param  {[type]}   obj [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
schema.statics._delete = async function(obj, cb) {
    var res = {deleted: 0, found: 0, error: null};
    try {
        var items = await this.find(obj);
        if(items.length < 1) {
            res.error = {'msg': 'No items found'};
            return res;
        }
    } catch(e) {
        if(items.length < 1) {
            res.error = e;
            return res;
        }
    }

    let item;
    for(let i = 0; i < items.length; i++)
    {
        try {
            item = items[i];
            var update = await CompanyType.updateOne({'_id': item.parent}, {'$pull': {'sub': item._id}});
            await item.delete();

            res.deleted++;
        } catch(e) {
            res.error = e;
            return res;
        }
    }

    return res;
};

module.exports = mongoose.model('SubCompanyType', schema);
