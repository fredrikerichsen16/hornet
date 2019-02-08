/**
 * DeclaredOption
 */

import {Option} from './Option';

export class DeclaredOption extends Option {
    types!: string[];
    description!: string;
    required!: boolean;
}
