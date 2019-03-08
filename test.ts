let find = require('lodash.find');

let arr = [
    {'name': 'bob', age: 21},
    {'name': 'jeff', age: 25},
    {'name': 'kev', age: 44}
];

let arr2 = [
    {'name': 'gian', age: 21},
    {'name': 'matti', age: 25},
    {'name': 'doven', age: 44}
];

let a = find(arr, {'name': 'kev'}) ||
        find(arr2, {'name': 'kev'});

a.name = 'fred';

console.log(arr);
console.log(arr2);
