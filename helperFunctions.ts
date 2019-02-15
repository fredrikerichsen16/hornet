export function flat(items : any[], key : string) {
    var result : any[] = [];
    for(let i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.hasOwnProperty(key) && item[key].length > 0) {
            result = result.concat(flat(item[key], key));
        }
        result.push(item);
    }
    return result;
}

export function flatten(items : any[], key : string) {
    items = flat(items, key);
    // for(let i = 0; i < items.length; i++) {
    //     delete items[i][key];
    // }
    return items;
}
