"use strict";
/**
 * DeclaredOption
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var DeclaredOption = /** @class */ (function (_super) {
    __extends(DeclaredOption, _super);
    function DeclaredOption(flags, description, required) {
        if (required === void 0) { required = false; }
        var _this = this;
        _this.deconstructFlags(flags);
        _this.description = description;
        _this.required = required;
        return _this;
        // console.log({
        //     short: this.short,
        //     long: this.long,
        //     types: this.types,
        //     description: this.description,
        //     required: this.required
        // });
    }
    /**
     * @example
     * Take a flag string like this: '-l --limit=[number:boolean]' and use regular expressions to
     * set the properties short=l, long=limit, and types=[number, boolean].
     * @todo
     * More error handling, if someone writes the wrong syntax, like --limit=[number, boolean] or something
     * @param  flags string like '-l, --limit' etc.
     * @return       void
     */
    DeclaredOption.prototype.deconstructFlags = function (flags) {
        var self = this;
        var patt = /(?<=\s|^)-\w(=\[\w+\]|(?=\s)|(?=,))/;
        var short = patt.exec(flags);
        if (short)
            self.short = short[0];
        /**
         * (?<=\s) -> positive lookbehind - checks pattern that is preceded by \s (whitespace), but
         *            doesn't include that whitespace in the returned pattern
         * --      -> long flags start with two dashes, like --save
         * \w+     -> then one or more characters for the name of the flag
         * (=\[\w+\]|(?=\s))
         *         -> =[one-or-more-characters] OR single whitespace (positive lookahead)
         */
        var patt = /(?<=\s|^)--\w+(=\[[\w:]+\]|(?=\s|$))/;
        var long = patt.exec(flags);
        if (long) {
            self.long = long[0];
            var patt = /(?<=(=\[))[\w:]+(?=(\]))/;
            var val = patt.exec(self.long);
            if (val) {
                var vals = val[0].split(':');
                self.types = vals;
            }
            else {
                self.types = ['boolean'];
            }
            self.long = self.long.replace(/=\[[[\w:]*\]/, '');
        }
    };
    return DeclaredOption;
}(Option_1.Option));
exports.DeclaredOption = DeclaredOption;
