/**
 * Super class for user-defined controllers and the DefaultController.
 * A controller is a class which contains methods for specific commands.
 * The default controller contains methods for commands like 'back'.
 * The user-defined controllers contain methods for all their stuff.
 */

import {hornet} from './hornet';

export abstract class controller {

    abstract name : string;

    hornet: hornet;

    constructor(hornet: hornet) {
        this.hornet = hornet;
    }

    printCommands() {
        let commands = this.hornet.commands;

        for(let i = 0; i < commands.length; i++)
        {
            let command = commands[i];

            console.log(command._name);
        }
    }

}
