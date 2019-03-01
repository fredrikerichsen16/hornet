"use strict";
/**
 * Default Controller for default commands which the user doesn't have to implement
 * himself. Commands like 'back'.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
class DefaultController extends controller_1.controller {
    /**
     * @todo
     * Default controller method calls generally shouldn't be tracked in the breadcrumb or the path.
     * Because then 'back' and traverseBack etc. are not reliable.
     * So add that functionality either in this class somehow or hornet.ts.
     */
    constructor(hornet) {
        super(hornet);
        /**
         * Name of controller (could take name of class, but if code is minified that doesn't work)
         */
        this.name = 'DEFAULT';
    }
    /**
     * Go back to the previous command that was run
     * @return [description]
     */
    back(options) {
        let self = this;
        /**
         * @todo
         * Right now it's hard to go back "up" because code doesn't know what options to pass.
         * Some commands
         *  -don't have any required commands, so those ones it's possible to go back "up"
         *      - just do path.pop(), find that command and run it with no options
         *  -have one or more required command with default values - possible to go back "up"
         *  -but what about commands where at least one of out of two options are required (that's a mess
         *  to deal with and write for users. Is it worth it? Maybe.)
         *
         * Possible solutions:
         *  - don't run the command, just go back and show the available options, but don't run the command
         *  - only run commands with no required options or ones with default values (show message for others)
         *  - complicated solution to make it work perfectly
         */
        function up() {
            self.hornet.path.pop();
            return undefined;
            return start();
            // self.hornet.path.pop();
            //
            // let command = self.hornet.findCommandsByPath(self.hornet.path, true);
            //
            // if(command) {
            //     let toCommand = new cmd(self.hornet, {'command': });
            //
            //     return command;
            // } else {
            //     self.hornet.path = [];
            //     return undefined;
            // }
        }
        function start() {
            self.hornet.path = [];
            return undefined;
        }
        function previous() {
            try {
                let toCommand;
                if (self.hornet.breadcrumb.length > 1) {
                    toCommand = self.hornet.breadcrumb[self.hornet.breadcrumb.length - 2];
                }
                else {
                    toCommand = self.hornet.breadcrumb[self.hornet.breadcrumb.length - 1];
                }
                toCommand.printInput = true;
                if (toCommand.command) {
                    return toCommand;
                }
                else {
                    console.log('"Back" does not work because of an error. Error #4721');
                    process.exit();
                }
            }
            catch (e) {
                console.log(e);
                process.exit();
                self.hornet.path = [];
                return undefined;
            }
        }
        if (options.hasOwnProperty('up') && options.up) {
            return up();
        }
        else if (options.hasOwnProperty('start') && options.start) {
            return start();
        }
        else // 'previous' (default behavior)
         {
            return previous();
        }
    }
}
exports.DefaultController = DefaultController;
