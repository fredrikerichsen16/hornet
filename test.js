"use strict";
// function scaryClown() {
//     // setTimeout(() => {
//     //     console.log('After 2 sec');
//     //
//     //     return 'BOOM';
//     // }, 2000);
//
//     return new Promise(resolve => {
//         setTimeout(() => {
//             console.log('heisann');
//             resolve('🤡');
//         }, 2000);
//     });
// }
//
// async function msg() {
//     const msg = await scaryClown();
//     console.log('Message:', msg);
//     console.log(typeof msg);
// }
//
// msg();
//
// console.log('hei');
require('./node/mongoose/app')();
let rootRequire = require('root-require');
let CompanyType = rootRequire('node/mongoose/models/companyTypes');
let Domain = rootRequire('node/mongoose/models/domains');
class Hei {
    async get() {
        // Domain.find({}, function(err : any, domains : any) {
        //     return domains;
        // });
        setTimeout(async () => {
            var domains = await Domain.findOne({});
            return domains;
        }, 2000);
        // const promise = new Promise((resolve, reject) => {
        //     Domain.find({}, function(err : any, domains : any) {
        //         resolve(domains);
        //     });
        // });
        // promise.then((res : any) => {
        //     console.log(res);
        //     return [res, null];
        // });
        // promise.catch((err) => {
        //     return [null, err];
        // });
    }
    async do() {
        // return new Promise(async (resolve, reject) => {
        //     setTimeout(async () => {
        //         let domain = await Domain.findOne({});
        //         console.log(domain.name);
        //         resolve(domain.name);
        //     }, 1000);
        // });
        let domain = await Domain.findOne({});
        console.log(domain.name);
        return domain.name;
        // return new Promise((resolve) => {
        //     setTimeout(async () => {
        //         var domain = await Domain.findOne({});
        //         console.log('Domain.');
        //         resolve(domain.name);
        //     }, 1000);
        // });
        // let domain : any = Domain.findOne({})
        //     .then((res : any) => {
        //         return res;
        //     }).catch((error : any) => {
        //         return error;
        //     });
    }
}
async function main() {
    var H = new Hei();
    console.log('pre');
    var result = await H.do();
    console.log('result');
    console.log(result);
    console.log('post result');
    return result;
}
(function a() {
    b();
})();
function b() {
    console.log('-------------------------');
    var z = main();
}
// const find = require('lodash/find');
// const cloneDeep = require('lodash/cloneDeep');
//
// var obj = [
//     {
//         'name': 'gregers',
//         'sub': [
//             {
//                 'name': 'jonas',
//                 'sub': [
//                     {
//                         'name': 'thomas'
//                     },
//                     {
//                         'name': 'kristoffer'
//                     }
//                 ]
//             },
//             {
//                 'name': 'sebastian',
//                 'sub': [
//                     {
//                         'name': 'johannes'
//                     },
//                     {
//                         'name': 'petter'
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         'name': 'morten'
//     },
//     {
//         'name': 'edvard',
//         'sub': [
//             {
//                 'name': 'ed'
//             }
//         ]
//     }
// ];
//
// var family = cloneDeep(obj);
//
// var a = find(family, {'name': 'gregers'}).sub;
// var b = find(a, {'name': 'jonas'}).sub;
// var c = find(b, {'name': 'thomas'});
//
// console.log(JSON.stringify(c));
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
