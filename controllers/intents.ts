import {controller} from '../controller';
import {hornet} from '../hornet';

export class intents extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'intents';

    list() {

    }

    detail() {

    }

}
