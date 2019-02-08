/**
 * Default Controller for default commands which the user doesn't have to implement
 * himself. Commands like 'back'.
 */

import {controller} from './controller';
import {hornet} from '../hornet';

export class DefaultController extends controller {

    constructor(hornet: hornet) {
        super(hornet);
    }

    /**
     * Name of controller (could take name of class, but if code is minified that doesn't work)
     */
    name: string = 'DEFAULT';

    back() : string {
        return 'back';
    }

}
