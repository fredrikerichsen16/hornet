"use strict";
/**
 * Define default commands
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("./Command");
let defaultController = 'DEFAULT';
function a(str) {
    return defaultController + '.' + str;
}
let defaultCommands = [
    new Command_1.Command()
        .passThrough()
        .name('back')
        .action(a('back'))
        .option('-p, --previous=[boolean]', 'Go back to previous command. (Default behavior without flag)')
        .option('-u, --up=[boolean]', 'Go back "up" in the nested tree structure.')
        .option('-s, --start=[boolean]', 'Go back to start.')
];
exports.defaultCommands = defaultCommands;
