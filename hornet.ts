var readlineSync = require('readline-sync');
// import * as readline from 'readline';
import {Command} from './Command';
import {Option} from './Option';
import {controller} from './controller';
import {DefaultController} from './DefaultController';
import {Run} from './Run';

class hornet extends Run {

    commands: Command[] = [];
    activeCommands: Command[] = [];

    /**
     * Object literal containing user-defined controllers.
     * key: name of controller
     * value: instance of controller class
     *
     * @problem
     * I think it should be {[key: string] : controller} -- but that creates an error, investigate that
     */
    controllers: {[key: string] : any} = {};

    run() : void {
        var self = this;
        this.activeCommands = JSON.parse(JSON.stringify(this.commands)); // deep copy (shitty solution)

        let nextcommand : string | null = null;
        while(true)
        {
            if(nextcommand)
            {

                nextcommand = null;
            }
            else
            {
                let command = readlineSync.question('>').trim(); // get user input
                if(command === '') continue;

                let commandAndFlags = self.decompose(command);
                command = commandAndFlags[0];
                let flags = commandAndFlags[1];

                /**
                 * Iterate over commands which are in the active domain
                 */
                let commandFound = false;
                for(let activeCmd of this.activeCommands) {
                    if(command === activeCmd._name) { // find the correct command
                        let action : string = activeCmd._action;
                        let actionAr : string[] = action.split('.');
                        let controller = actionAr[0];
                        let method = actionAr[1];

                        // find valid flags

                        nextcommand = self.controllers[activeCmd._controller][activeCmd._method]();
                        commandFound = true;
                        break;
                    }
                }

                if(!commandFound) {
                    console.log('Command not found');
                }
            }
        }
    }

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
    register(...controllers : any[]): void {
        var self = this;

        for(let cont of controllers) {
            if(cont.name === 'DEFAULT') {
                throw new Error('"DEFAULT" is a reserved controller name, use a different name.');
            }
            self.controllers[cont.name] = <controller> new cont(self);
        }

        self.controllers['DEFAULT'] = <controller> new DefaultController(self);
    }

}

export {hornet, Command as command};

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
