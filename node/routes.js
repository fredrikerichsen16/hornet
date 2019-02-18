/**
 * To do when I get back:
 *  at top of app.js, instead of writing:
 *  app = require('express');
 *  express = app();
 *
 *  do this:
 *  app = require('./app');
 *  express = app();
 *
 *  app.js:
 *  module.exports = require('express');
 *
 *  or something like that, so that app is accessible everywhere. Especially needed in the controllers now.
 */

module.exports = function(app) {
    let express = require('express'),
        router =  express.Router(),
        rootRequire = require('root-require'),
        prefix;

    let namedRouter = require('named-routes');
    let NamedRouter = new namedRouter();
    NamedRouter.extendExpress(app);
    NamedRouter.registerAppHelpers(app);
    NamedRouter.extendExpress(router);

    app.use(function(req, res, next) {
        app.locals.session = req.session;

        next();
    });

    // /admin

    var companyTypesController = rootRequire('node/controllers/companyTypesController');
    router.get(
        '/admin/company-info/types',
        'admin.companyInfo.list',
        companyTypesController.list);
    router.post(
        '/admin/company-info/type/create',
        'admin.companyInfo.create',
        companyTypesController.create);
    router.get(
        '/admin/company-info/type/:companyTypeSlug',
        'admin.companyInfo.detail',
        companyTypesController.detail);
    router.post(
        '/admin/company-info/type/set-active',
        'admin.companyInfo.setActive',
        companyTypesController.setActive);
    router.get(
        '/admin/company-info/short-term',
        'admin.companyInfo.shortTerm',
        companyTypesController.shortTerm);
    router.get(
        '/admin/company-info/long-term',
        'admin.companyInfo.longTerm',
        companyTypesController.longTerm);

    var intentsController = rootRequire('node/controllers/intentsController');
    router.get(
        '/admin/intents',
        'admin.intents.list',
        intentsController.list);
    router.post(
        '/admin/intents/edit-as',
        'admin.intents.editAs',
        intentsController.editAs
    )

    // /customer
    router.get('/customer/', function(req, res, next) {
        res.render('customer/home.html');
    });

    app.use(router);

};
