import {controller} from '../controller';
import {hornet} from '../hornet';

export class domains extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'domains';

    list() : string {
        return 'back';
    }

}
