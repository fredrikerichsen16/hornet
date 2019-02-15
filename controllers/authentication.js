"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../controller");
class authentication extends controller_1.controller {
    constructor(hornet) {
        super(hornet);
        this.name = 'authentication';
    }
    signin(options) {
        if (options.admin) {
            console.log('You signed in as admin');
        }
        else {
            let username = this.readline('Username: ', 'green');
            let password = this.readline('Password: ', 'cyan');
            console.log(`You just signed in with the username ${username}`);
        }
        this.traverseForward();
    }
    signup(options) {
        let username = this.readline('Username: ');
        let password = this.readline('Password: ');
        console.log('Signed up!');
        this.traverseForward();
    }
}
exports.authentication = authentication;
