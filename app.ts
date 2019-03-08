import {hornet} from "./main/hornet";
import {Command as command} from "./command/Command";

// controllers
import {domains} from './controllers/domains';
import {authentication} from './controllers/authentication';

var CLI = new hornet();

CLI.welcomeMessage = "Welcome to this CLI my dear friends!";

CLI.setCommands([
    new command()
    .name('start', 'Hei du!')
    .action('authentication.start')
    .default(),

    new command()
    .name('signup')
    .action('authentication.signup'),

    new command()
    .name('signin', 'Sign in page')
    .flag('-a, --admin=[boolean]', 'Automatically sign in as admin.')
    .action('authentication.signin')
    .sub(
        new command()
        .name('a1', 'A1')
        .action('domains.a1')
        .sub(
            new command()
            .name('a2', 'A2')
            .action('domains.a2')
            .sub(
                new command()
                .name('a3', 'A3')
                .action('domains.a3')
            )
        )
    )
]);

CLI.register(authentication, domains);

CLI.run();
