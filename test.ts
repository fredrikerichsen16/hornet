const find = require('lodash/find');
const cloneDeep = require('lodash/cloneDeep');

var obj = [
    {
        'name': 'gregers',
        'sub': [
            {
                'name': 'jonas',
                'sub': [
                    {
                        'name': 'thomas'
                    },
                    {
                        'name': 'kristoffer'
                    }
                ]
            },
            {
                'name': 'sebastian',
                'sub': [
                    {
                        'name': 'johannes'
                    },
                    {
                        'name': 'petter'
                    }
                ]
            }
        ]
    },
    {
        'name': 'morten'
    },
    {
        'name': 'edvard',
        'sub': [
            {
                'name': 'ed'
            }
        ]
    }
];

var family = cloneDeep(obj);

var a = find(family, {'name': 'gregers'}).sub;
var b = find(a, {'name': 'jonas'}).sub;
var c = find(b, {'name': 'thomas'});

console.log(JSON.stringify(c));

//
// function makePath(obj : any, path : string[] = []) {
//     for(let i = 0, len = obj.length; i < len; i++) {
//         let item = obj[i];
//         item.path = path;
//         if(item.hasOwnProperty('sub') && item.sub !== []) {
//             makePath(item.sub, path.concat([item.name]));
//         }
//     }
// }
//
// makePath(obj);
//
// console.log(JSON.stringify(obj, undefined, 4));








// for (var i = 0; i < data.length; i++) {
//                   if(data[i]){
//                       process( data[i]);
//                   }
//               }
//
// function process(val) {
//   val.lowerText = val.text.toLowerCase();
//   if(val.items){
//       for(var i = 0, len = val.items.length; i < len; i++) {
//           process(val.items[i]);
//       }
//   }





// var obj = {'a': 1, 'b': {'c': 1, 'd': 1}};
// function edit(obj : any, k : string) {
//     obj[k] = 2;
//
//     if(k === 'a') edit(obj.b, 'd');
// }
// edit(obj, 'a');
// console.log(obj);

// import {cmd} from './cmd';
//
// var CMD : typeof cmd = cmd;
//
// function run(command : typeof cmd) {
//     console.log(typeof command);
//
//     var c = new command({'action': 'back'});
//
//     return c.action;
// }
//
// var a = run(CMD);
//
// console.log(a);


// var find = require('lodash/find');
//
// var users = [
//     {'name': 'bob', 'age': 20},
//     {'name': 'jeff', 'age': 44},
//     {'name': 'gigi', 'age': 26},
//     {'name': 'ryan', 'age': 22}
// ];
//
// var result = find(users, {'name': 'bob'});
//
// console.log(result);


// function getTuple(){
//    return ["Bob", 24];
// }
//
// var [n, a] = getTuple();
//
// console.log(n, a);

// let s : string = "-n, --quick[boolean:string]";
// var patt = /(?<=\s|^)--\w+(=\[\D+\]|(?=\s|$))/;
// var long = patt.exec(s);
// if(long) {
//     var longStr = long[0];
//     var patt = /(?<=(=\[))[A-Za-z:]+(?=(\]))/;
//     var val = patt.exec(longStr);
//     console.log(val);
// }


// abstract class Controller {
//     abstract name: string;
// }
//
// class Home extends Controller {
//     name: string = 'manu';
// }
//
// class Away extends Controller {
//     name: string = 'liverpool';
// }
//
// class A {
//     register(C : Controller) {
//         console.log(C.name);
//     }
// }
//
// let a = new A();
//
// let c : Controller = new Home();

// class A {
//     a!: string;
//     b!: number;
//
//     constructor(a : string | null = null, b : number | null = null) {
//         if(a) this.a = a;
//         if(b) this.b = b;
//     }
// }
//
// class B extends A {
//     c!: string;
//     d!: number;
//
//     constructor(a: string, b: number, c: string, d: number) {
//         super();
//         this.c = c;
//         this.d = d;
//
//         super(a, b);
//     }
// }
//
// let b : B = new B("A", 1, "B", 2);
//
// console.log(b.a, b.b, b.c, b.d);
