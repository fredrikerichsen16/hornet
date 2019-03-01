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
    .name('back')
    .action(a('back'))
    .option('-p, --previous=[boolean]', 'Go back to previous command. (Default behavior without flag)')
    .option('-u, --up=[boolean]', 'Go back "up" in the nested tree structure.')
    .option('-s, --start=[boolean]', 'Go back to start.')
];

export {defaultCommands};
