# hornet-cli

### Command line interface (CLI) building library for Node.js which supports nesting.
This CLI library is almost completed. All the features below in the example are working. There may be some bugs. The code is a bit spaghetti.

# Why is this useful?
Because none of the other CLI libraries I found support nested commands.

The primary use case is creating a basic admin panel for your application I reckon. It may also be useful for simple personal projects.
I made this because I was making a side project with complicated database relations that I needed to do CRUD operations on (mainly insert a lot of data). Using the database GUI tool or code would be too tedious, and making an admin panel web client would be too time consuming.

# Upcoming features
Feel free to contribute these features or to the project in general.
- middleware
- defining functions directly in the app structure instead of .action('controller.method')
- support other input types than pure text. E.g. Select from a list of options, and autocomplete. Like Inquirer.js

# Example
Hopefully the example code below is good enough to get started. I might get around to writing documentation one day.

### Define app structure
```
import {hornet, command} from "hornet-cli/imports/main";

// controllers
import {authentication} from './controllers/authentication';
import {users} from './controllers/users';
import {posts} from './controllers/posts';

var CLI = new hornet();

CLI.setCommands([
    new command()
    .name('signup')
    .action('authentication.signup'),

    new command()
    .name('signin', 'Sign in page')
    .flag('-a, --admin=[boolean]', 'Automatically sign in as admin.')
    .action('authentication.signin')
    .sub(
        new command()
        .name('users', 'List all users')
        .action('users.list')
        .flag('-l, --limit=[number]', 'Limit amount of users to show.')
        .sub(
            new command()
            .name('view', 'View profile')
            .argument('<username:string>')
            .action('users.detail')
            .sub(
                new command()
                .name('posts')
                .action('posts.list')
            ),

            new command()
            .name('next', "See next x users (if you used --limit previously and didn't show all users)")
            .argument('<limit:number>')
            .action('users.next')
        ),

        new command()
        .name('my-profile', 'View your own profile')
        .action('users.myProfile')
        .sub(
            new command()
            .name('post', 'Post your favorite colors')
            .argument('[colors:string]') // [] = array argument, <> = single argument
            .action('users.post')
        )
    )
]);

CLI.register(authentication, users, posts); // register controllers

CLI.run();
```

### Create controllers
```
import {controller, hornet, types} from "hornet-cli/imports/controller";

export class users extends controller {

    /**
     * Constructor (required)
     */
    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (required)
     */
    name: string = 'users';

    HELP(options : types.FreeObjectLiteral) {
        // all options passed are available in 'options' with the name given to them when you defined your app structure

        // METHODS:

        // get user input
        // args: question, color (powered by chalk), trim (default is true)
        let name = this.readline('Name: ', 'red', true);
        let over18 = this.readlineYN('Are you over 18? (Y/N)', 'blue', true); (if input 'Y' or 'y' return true, else return false)

        // sessions
        this.session.set('id', 1, true) // last argument is whether or not to overwrite if session is already set
        this.session.get('id')
        this.session.remove('id')

        // traverse forwards/backwards
        this.traverseForward(); // go to the sub commands the current command
        this.traverseBackward(); // go to the parent commands the current command

        // Going to the next command
        return undefined; // return from this method, allow user to input next command
        return this.cmd({'name': 'signin'}) // go to specific command 'signin'
                                            // you can also go to an action 'action': 'controllerName.methodName'
                                            // or write the next command literally {'command': 'users --limit=20'}
        return this.cmd({'name': 'users', 'options': {'limit': 20}}); // and you can pass options
    }

    list(options : types.FreeObjectLiteral) { // type cast is optional
        let users = db.getUsers();

        for(user in users) {
            console.log(this.color(user.username, 'blue'));
        }

        this.traverseForward();

        return undefined;
    }

    /**
     * Use async/await or promises if you are doing anything with synchronously like DB requests
     */
    async view(options : types.FreeObjectLiteral) {
        let username = options.username;

        if(username) {
            let user = await db.getUser(username);
            console.log('Username: ' + user.username);
            console.log('Location: ' + user.location);
            console.log('Age: ' + user.age);

            this.traverseForward();
        } else {
            console.log('User with username ' + username + ' not found');
        }

        return undefined;
    }

    ...
}
```
