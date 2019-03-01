"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller/controller");
class authentication extends controller_1.controller {
    constructor(hornet) {
        super(hornet);
        this.name = 'authentication';
    }
    signin(options) {
        if (this.session.get('domains')) {
            console.log('We got da message by the way.. ' + this.session.get('domains')[0]);
        }
        if (options.admin) {
            console.log('You signed in as admin');
            return this.traverseForward();
        }
        else {
            let username = this.readline('Username: ', 'green');
            let password = this.readline('Password: ', 'cyan');
            if (username !== 'a' || password !== 'a') {
                console.log('Wrong password.');
                return;
            }
            console.log(`You just signed in with the username ${username}`);
            return this.traverseForward();
        }
    }
    signup(options) {
        let username = this.readline('Username: ');
        let password = this.readline('Password: ');
        console.log('Signed up!');
        this.traverseForward();
    }
}
exports.authentication = authentication;
