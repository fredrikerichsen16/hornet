/**
 * [flat description]
 * @param  items [description]
 * @param  key   [description]
 * @return       [description]
 */
export function flatten(items : any[], key : string) {
    var result : any[] = [];
    for(let i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.hasOwnProperty(key) && item[key].length > 0) {
            result = result.concat(flatten(item[key], key));
        }
        result.push(item);
    }
    return result;
}
