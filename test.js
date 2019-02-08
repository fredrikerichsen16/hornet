"use strict";
// function getTuple(){
//    return ["Bob", 24];
// }
//
// var [n, a] = getTuple();
//
// console.log(n, a);
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
var A = /** @class */ (function () {
    function A(a, b) {
        if (a === void 0) { a = null; }
        if (b === void 0) { b = null; }
        if (a)
            this.a = a;
        if (b)
            this.b = b;
    }
    return A;
}());
var B = /** @class */ (function (_super) {
    __extends(B, _super);
    function B(a, b, c, d) {
        var _this = _super.call(this) || this;
        _this.c = c;
        _this.d = d;
        _this = _super.call(this, a, b) || this;
        return _this;
    }
    return B;
}(A));
var b = new B("A", 1, "B", 2);
console.log(b.a, b.b, b.c, b.d);
