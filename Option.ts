/**
 * The Command class contains a property which is an array of Option instances.
 * A command can have a number of options, for example -s, --save and -l, --limit=[number].
 * This class encapsulates those options in a structured format rather than as strings.
 */

export class Option {
    short?: string;   // shorthand name of option
    long?: string;    // long name of option
}
