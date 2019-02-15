import {controller} from '../controller';
import {hornet} from '../hornet';

export class authentication extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    name: string = 'authentication';

    signin(options : any) {
        if(options.admin) {
            console.log('You signed in as admin');
        } else {
            let username = this.readline('Username: ', 'green');
            let password = this.readline('Password: ', 'cyan');

            console.log(`You just signed in with the username ${username}`);
        }

        this.traverseForward();
    }

    signup(options : any) {
        let username = this.readline('Username: ');
        let password = this.readline('Password: ');

        console.log('Signed up!');
        this.traverseForward();
    }

}
