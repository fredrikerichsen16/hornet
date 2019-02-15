// console.log('nextcommand', nextcommand);
// nextcommand = null;
//
// return new cmd({
//     'action': 'controller.method',
//     'options': [{'key': 'value'}]
// });
//
// return new cmd({
//     'command': 'command --save=true'
// });
//
// return new cmd({'action': 'back'});
//
// return new cmd('controller.method', [{'key': 'value'}]);
// return new cmd('back');
// return new cmd('command --save=true');

// possible nextcommands:
//  - straight text - command(somecommand --key=value)
//  - return functions like 'goto(controller.method)'
//  - specific command (Command)
