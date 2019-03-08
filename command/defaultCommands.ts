/**
 * Define default commands
 */

import {Command as command} from "./Command";

let defaultController = 'DEFAULT';

function a(str : string) {
    return defaultController + '.' + str;
}

let defaultCommands = [
    new command()
    .passThrough()
    .name('back', 'Go back to the previous command')
    .flag('-s, --start=[boolean]', 'Go back to start.')
    .argument('<steps:number>', 'How many steps to go back', false)
    .action(a('back')),

    new command()
    .name('default')
    .action(a('default'))
    .hidden()
    .default(),

    new command()
    .name('error')
    .action(a('error'))
    .passThrough()
    .hidden()
];

export {defaultCommands};
