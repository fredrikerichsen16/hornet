let rootRequire = require('root-require'),
	CompanyType = rootRequire('node/mongoose/models/companyTypes'),
	namedRoutes = rootRequire('getApp').namedRoutes;

/**
 * List company types
 *
 * Request Method: GET
 */
module.exports.list = function(req, res, next) {
	CompanyType.getAll(function(err, items) {
		if (err) res.json(err);

		res.render('admin/company-info/types.html', {
			companyTypes: items
		});
	});
};

/**
 * Create new company type
 */
module.exports.create = function(req, res, next) {
	var create = {};
	create.name = req.body.name;
	var subtypeof = req.body.subtypeof;
	if (subtypeof !== 'null') create.subtypeof = subtypeof;

	CompanyType.create(create, function(err, item) {
		if (err) res.end('Could not create company type.');

		if (item) {
			res.redirect(namedRoutes.build('admin.companyInfo.list'));
		} else {
			res.end('wtf');
		}
	});
};

/**
 * View one company type details
 */
module.exports.detail = function(req, res, next) {
	var companyTypeSlug = req.params.companyTypeSlug;

	CompanyType.findOne({
		'slug': companyTypeSlug
	}, function(err, item) {
		if (err) res.end('Error encountered');

		if (item) {
			res.render('admin/company-info/type.html', {
				companyType: item
			});
		}
	});
};

/**
 * Set one company type as active - i.e. the one you're adding intents, domains, training sentences etc. to
 */
module.exports.setActive = function(req, res, next) {
	var source = req.header('Referer') || '/';

	req.session.companyTypeId = req.body.id;
	req.session.companyTypeName = req.body.name;

	res.redirect(source);
};

/**
 * Short Term page
 */
module.exports.shortTerm = function(req, res, next) {
	let Domain = rootRequire('node/mongoose/models/domains');
	let Intent = rootRequire('node/mongoose/models/intents');

	// var deletedDomains = await Domain.deleteMany({});
	// var deletedIntents = await Intent.deleteMany({});
	//
	// console.log('deletedDomains', deletedDomains);
	// console.log('deletedIntents', deletedIntents);
	//
	// Domain.createDomain({'name': 'booking', 'scope': {'companyTypes': '5c284f1f45e8470722678e96'}}, function(err, item) {
	//     Intent.createIntent({'name': 'request', 'domain': item._id, 'scope': {'companyTypes': '5c284f1f45e8470722678e96'}}, function(err, i) {
	//         Intent.createIntent({'name': 'cancel', 'domain': item._id, 'scope': {'companyTypes': '5c284f1f45e8470722678e96'}}, function(err, i) {
	//             Domain.createDomain({'name': 'booking', 'scope': {'companyTypes': '5c284f1f45e8470722678e90'}}, function(err, item2) {
	//                 Intent.createIntent({'name': 'request', 'domain': item2._id, 'scope': {'companyTypes': '5c284f1f45e8470722678e90'}}, function(err, i) {
	//                     Intent.createIntent({'name': 'cancel', 'domain': item2._id, 'scope': {'companyTypes': '5c284f1f45e8470722678e90'}}, function(err, i) {
	//
	//                     });
	//                 });
	//             });
	//         });
	//     });
	// });

	Domain.aggregate().match({'name': 'booking'}).exec(function(err, items) {
		res.json(items);
	});

	// Domain.getMany({'companyTypes': '5c284f1f45e8470722678e96'}, function(err, items) {
	//     res.json(items);
	// });

	// Domain.getDomains({'companyTypes': '5c284f1f45e8470722678e96'}, (err, items) => {
	//     items.global().exec(function(err, items2) {
	//         res.json(items2);
	//     });
	// });
};

/**
 * Long Term page
 */
module.exports.longTerm = function(req, res, next) {
	res.render('admin/company-info/long-term.html');
};
