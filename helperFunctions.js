"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flat(items, key) {
    var result = [];
    for (let i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.hasOwnProperty(key) && item[key].length > 0) {
            result = result.concat(flat(item[key], key));
        }
        result.push(item);
    }
    return result;
}
exports.flat = flat;
function flatten(items, key) {
    items = flat(items, key);
    // for(let i = 0; i < items.length; i++) {
    //     delete items[i][key];
    // }
    return items;
}
exports.flatten = flatten;
