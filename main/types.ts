import {cmd} from '../command/cmd';

// javascript object literal with any values {}
export type FreeObjectLiteral = {[key: string] : any};

// return type from a controller method - can either be an instantiated cmd or undefined
export type cmd = cmd | undefined;

// any primitive
export type primitive = string | number | boolean;
