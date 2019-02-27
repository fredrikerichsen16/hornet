import {controller} from '../controller/controller';
import {hornet} from '../main/hornet';

export class authentication extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    name: string = 'authentication';

    signin(options : any) {
        if(options.admin) {
            console.log('You signed in as admin');
            return this.traverseForward();
        } else {
            let username = this.readline('Username: ', 'green');
            let password = this.readline('Password: ', 'cyan');

            if(username !== 'a' || password !== 'a') {
                console.log('Wrong password.');
                return;
            }

            console.log(`You just signed in with the username ${username}`);
            return this.traverseForward();
        }
    }

    signup(options : any) {
        let username = this.readline('Username: ');
        let password = this.readline('Password: ');

        console.log('Signed up!');
        this.traverseForward();
    }

}
