import {Command as command} from "./Command";

let defaultController = 'DEFAULT';

function a(str : string) {
    return defaultController + '.' + str;
}

let defaultCommands = [
    new command()
    .name('back')
    .action(a('back'))
    .option('-u, --up=[boolean]', 'Go back "up" in the nested tree structure. (Default behavior without flag)')
    .option('-p, --previous=[boolean]', 'Go back to previous command.')
    .option('-s, --start=[boolean]', 'Go back to start.')
];

export {defaultCommands};
