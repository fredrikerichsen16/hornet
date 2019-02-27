import {hornet} from "./main/hornet";
import {Command as command} from "./command/Command";

// controllers
import {domains} from './controllers/domains';
import {intents} from './controllers/intents';
import {authentication} from './controllers/authentication';

var CLI = new hornet();

require('./node/mongoose/app')();

CLI.setCommands([
    new command()
    .name('signup')
    .action('authentication.signup'),

    new command()
    .name('signin', 'Sign in page')
    .option('-a, --admin=[boolean]', 'Automatically sign in as admin.')
    .action('authentication.signin')
    .sub(
        new command()
        .name('list-domains', 'List domains')
        .action('domains.list')
        .option('-l, --limit=[number:boolean]', 'Limit amount of results to show.', false)
        .sub(
            new command()
            .name('create', 'Create domain')
            .action('domains.create'),

            new command()
            .name('domain-detail', 'Show details of one domain')
            .action('domains.detail')
            .option('-i, --index=[number]', 'Domain index to show details of')
            .option('-n, --name=[string]', 'Name of domain to show details of')
            .sub(
                new command()
                .name('update', 'Update this domain')
                .option('-q --quick', 'Quick update')
                .action('domains.update'),

                new command()
                .name('delete', 'Delete this domain')
                .action('domains.delete'),

                new command()
                .name('list-intents', 'List intents under this domain')
                .action('intents.listIntents')
                .option('-l, --limit=[number]', 'Limit amount of results to show.', false)
                .sub(
                    new command()
                    .name('intent-detail', 'Show details of one intent')
                    .action('intents.detail')
                    .option('-i, --index=[number]', 'Intent index to show details of')
                    .option('-n, --name=[string]', 'Name of intent to show details of')
                )
            )
        )
    )
]);

CLI.register(authentication, domains, intents);

CLI.run();
