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


class A {
    a!: string;
    b!: number;

    constructor(a : string | null = null, b : number | null = null) {
        if(a) this.a = a;
        if(b) this.b = b;
    }
}

class B extends A {
    c!: string;
    d!: number;

    constructor(a: string, b: number, c: string, d: number) {
        super();
        this.c = c;
        this.d = d;

        super(a, b);
    }
}

let b : B = new B("A", 1, "B", 2);

console.log(b.a, b.b, b.c, b.d);
