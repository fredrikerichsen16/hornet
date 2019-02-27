"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [flat description]
 * @param  items [description]
 * @param  key   [description]
 * @return       [description]
 */
function flatten(items, key) {
    var result = [];
    for (let i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.hasOwnProperty(key) && item[key].length > 0) {
            result = result.concat(flatten(item[key], key));
        }
        result.push(item);
    }
    return result;
}
exports.flatten = flatten;
