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
        .name('back', 'Go back to the previous command')
        .flag('-s, --start=[boolean]', 'Go back to start.')
        .argument('<steps:number>', 'How many steps to go back', false)
        .action(a('back')),
    new Command_1.Command()
        .name('default')
        .action(a('default'))
        .hidden()
        .default(),
    new Command_1.Command()
        .name('error')
        .action(a('error'))
        .passThrough()
        .hidden()
];
exports.defaultCommands = defaultCommands;
