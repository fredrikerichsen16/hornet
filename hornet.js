"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var readlineSync = require('readline-sync');
// import * as readline from 'readline';
var Command_1 = require("./Command");
exports.command = Command_1.Command;
var DefaultController_1 = require("./DefaultController");
var Run_1 = require("./Run");
var hornet = /** @class */ (function (_super) {
    __extends(hornet, _super);
    function hornet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.commands = [];
        _this.activeCommands = [];
        /**
         * Object literal containing user-defined controllers.
         * key: name of controller
         * value: instance of controller class
         *
         * @problem
         * I think it should be {[key: string] : controller} -- but that creates an error, investigate that
         */
        _this.controllers = {};
        return _this;
    }
    hornet.prototype.run = function () {
        var self = this;
        this.activeCommands = JSON.parse(JSON.stringify(this.commands)); // deep copy (shitty solution)
        var nextcommand = null;
        while (true) {
            if (nextcommand) {
                nextcommand = null;
            }
            else {
                var command = readlineSync.question('>').trim(); // get user input
                if (command === '')
                    continue;
                var commandAndFlags = self.decompose(command);
                command = commandAndFlags[0];
                var flags = commandAndFlags[1];
                /**
                 * Iterate over commands which are in the active domain
                 */
                var commandFound = false;
                for (var _i = 0, _a = this.activeCommands; _i < _a.length; _i++) {
                    var activeCmd = _a[_i];
                    if (command === activeCmd._name) { // find the correct command
                        var action = activeCmd._action;
                        var actionAr = action.split('.');
                        var controller_1 = actionAr[0];
                        var method = actionAr[1];
                        // find valid flags
                        var validFlags = activeCmd.getValidFlags(flags);
                        nextcommand = self.controllers[activeCmd._controller][activeCmd._method]();
                        commandFound = true;
                        break;
                    }
                }
                if (!commandFound) {
                    console.log('Command not found');
                }
            }
        }
    };
    /**
     * Register controllers so they can be accessed in the property 'controllers' - a literal object with all
     * user-defined controllers.
     * @param  ...controllers controller classes (must be subclass of controller)
     * @return                void
     *
     * @problem
     * Signature should be the following, but Liskov's Substitution Principle aint workin for
     * some reason, so I'll use "any".
     * register(...controllers : controller[]): void {
     */
    hornet.prototype.register = function () {
        var controllers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            controllers[_i] = arguments[_i];
        }
        var self = this;
        for (var _a = 0, controllers_1 = controllers; _a < controllers_1.length; _a++) {
            var cont = controllers_1[_a];
            if (cont.name === 'DEFAULT') {
                throw new Error('"DEFAULT" is a reserved controller name, use a different name.');
            }
            self.controllers[cont.name] = new cont(self);
        }
        self.controllers['DEFAULT'] = new DefaultController_1.DefaultController(self);
    };
    return hornet;
}(Run_1.Run));
exports.hornet = hornet;
/*

def start(self):
        # self.connect_to_db()
        nextcommand = self.first_func

        while True:
            command = nextcommand or input()
            if command.strip() == '':
                continue

            command, params = self.split_command_and_params(command)
            commands = self.get_current_context_commands()

            try:
                command_dict = next(c for c in commands if c['command'] == command)
            except StopIteration:
                # Is thrown if next() is passed an empty list, i.e. the user inputted a non-existent command
                print('No such command as "{}"'.format(command))
                continue

            if command_dict:
                self.add_to_breadcrumb(command_dict)
                print(self.breadcrumb)

                try:
                    command_method = getattr(self, command_dict['func'])
                except AttributeError:
                    # Is thrown if the method doesn't exist
                    print('No such method ({}) exists. Create one!'.format(command_dict['func']))
                    continue
            else:
                print('Command not found.')
                continue

            self.clearscreen()
            print('Command: {}\nDescription: {}\n'.format(command, command_dict['description']))
            nextcommand = command_method(*params)

*/
