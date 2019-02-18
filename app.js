"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hornet_1 = require("./main/hornet");
const Command_1 = require("./command/Command");
// controllers
const domains_1 = require("./controllers/domains");
const intents_1 = require("./controllers/intents");
const authentication_1 = require("./controllers/authentication");
var CLI = new hornet_1.hornet();
require('./node/mongoose/app')();
CLI.setCommands([
    new Command_1.Command()
        .name('signup')
        .action('authentication.signup'),
    new Command_1.Command()
        .name('signin', 'Sign in page')
        .option('-a, --admin=[boolean]', 'Automatically sign in as admin.')
        .action('authentication.signin')
        .sub(new Command_1.Command()
        .name('list-domains', 'List domains')
        .action('domains.list')
        .option('-l, --limit=[number:boolean]', 'Limit amount of results to show.', false)
        .sub(new Command_1.Command()
        .name('create', 'Create domain')
        .action('domains.create'), new Command_1.Command()
        .name('domain-detail', 'Show details of one domain')
        .action('domains.detail')
        .option('-i, --index=[number]', 'Domain index to show details of')
        .option('-n, --name=[string]', 'Name of domain to show details of')
        .sub(new Command_1.Command()
        .name('update', 'Update this domain')
        .option('-q --quick', 'Quick update')
        .action('domains.update'), new Command_1.Command()
        .name('delete', 'Delete this domain')
        .action('domains.delete'), new Command_1.Command()
        .name('list-intents', 'List intents under this domain')
        .action('intents.list')
        .option('-l, --limit=[number]', 'Limit amount of results to show.', false)
        .sub(new Command_1.Command()
        .name('intent-detail', 'Show details of one intent')
        .action('intents.detail')
        .option('-i, --index=[number]', 'Intent index to show details of')
        .option('-n, --name=[string]', 'Name of intent to show details of')))))
]);
CLI.register(authentication_1.authentication, domains_1.domains, intents_1.intents);
CLI.run();
