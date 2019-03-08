"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hornet_1 = require("./main/hornet");
const Command_1 = require("./command/Command");
// controllers
const domains_1 = require("./controllers/domains");
const authentication_1 = require("./controllers/authentication");
var CLI = new hornet_1.hornet();
CLI.welcomeMessage = "Welcome to this CLI my dear friends!";
CLI.setCommands([
    new Command_1.Command()
        .name('start', 'Hei du!')
        .action('authentication.start')
        .default(),
    new Command_1.Command()
        .name('signup')
        .action('authentication.signup'),
    new Command_1.Command()
        .name('signin', 'Sign in page')
        .flag('-a, --admin=[boolean]', 'Automatically sign in as admin.')
        .action('authentication.signin')
        .sub(new Command_1.Command()
        .name('a1', 'A1')
        .action('domains.a1')
        .sub(new Command_1.Command()
        .name('a2', 'A2')
        .action('domains.a2')
        .sub(new Command_1.Command()
        .name('a3', 'A3')
        .action('domains.a3'))))
]);
CLI.register(authentication_1.authentication, domains_1.domains);
CLI.run();
