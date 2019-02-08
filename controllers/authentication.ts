import {controller} from '../controller';
import {hornet} from '../hornet';

export class authentication extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    name: string = 'authentication';

    signin() {
        console.log('SIGN IN!!!');

        return 'signup';
    }

    signup() {
        console.log('Sign UP!');

        return null;
    }

}
