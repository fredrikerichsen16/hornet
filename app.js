"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hornet_1 = require("./hornet");
// controllers
var domains_1 = require("./controllers/domains");
var intents_1 = require("./controllers/intents");
var authentication_1 = require("./controllers/authentication");
var CLI = new hornet_1.hornet();
// CLI.startCommand = new command().defaultStartCommand();
CLI.commands = [
    new hornet_1.command()
        .name('signup')
        .action('authentication.signup'),
    new hornet_1.command()
        .name('signin', 'Sign in page')
        .action('authentication.signin')
        .sub(new hornet_1.command()
        .name('list-domains', 'List domains')
        .action('domains.list')
        .option('-l, --limit=[number:boolean]', 'Limit amount of results to show.', false)
        .sub(new hornet_1.command()
        .name('create', 'Create domain')
        .action('domains.create'), new hornet_1.command()
        .name('domain-detail', 'Show details of one domain')
        .action('domains.detail')
        .option('-i, --index=[number]', 'Domain index to show details of')
        .option('-n, --name=[string]', 'Name of domain to show details of')
        .sub(new hornet_1.command()
        .name('update', 'Update this domain')
        .option('-q --quick', 'Quick update')
        .action('domains.detail_update'), new hornet_1.command()
        .name('delete', 'Delete this domain')
        .action('domains.detail_delete'), new hornet_1.command()
        .name('list-intents', 'List intents under this domain')
        .action('intents.list')
        .option('-l, --limit=[number]', 'Limit amount of results to show.', false)
        .sub(new hornet_1.command()
        .name('intent-detail', 'Show details of one intent')
        .action('intents.detail')
        .option('-i, --index=[number]', 'Intent index to show details of')
        .option('-n, --name=[string]', 'Name of intent to show details of')))))
];
CLI.register(authentication_1.authentication, domains_1.domains, intents_1.intents);
CLI.run();
