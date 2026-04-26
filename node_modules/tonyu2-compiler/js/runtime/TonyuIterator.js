//define(["Klass"], function (Klass) {
//var Klass=require("../lib/Klass");
const SYMIT = Symbol.iterator;
class ArrayValueIterator {
    set;
    i;
    [0];
    [1];
    constructor(set) {
        this.set = set;
        this.i = 0;
    }
    next() {
        if (this.i >= this.set.length)
            return false;
        this[0] = this.set[this.i];
        this.i++;
        return true;
    }
}
class ArrayKeyValueIterator {
    constructor(set) {
        this.set = set;
        this.i = 0;
    }
    set;
    i;
    [0];
    [1];
    next() {
        if (this.i >= this.set.length)
            return false;
        this[0] = this.i;
        this[1] = this.set[this.i];
        this.i++;
        return true;
    }
}
class ObjectKeyIterator {
    elems;
    constructor(set) {
        this.elems = [];
        for (var k in set) {
            this.elems.push(k);
        }
        this.i = 0;
    }
    set;
    i;
    [0];
    [1];
    next() {
        if (this.i >= this.elems.length)
            return false;
        this[0] = this.elems[this.i];
        this.i++;
        return true;
    }
}
class ObjectKeyValueIterator {
    elems;
    constructor(set) {
        this.elems = [];
        for (var k in set) {
            this.elems.push([k, set[k]]);
        }
        this.i = 0;
    }
    set;
    i;
    [0];
    [1];
    next() {
        if (this.i >= this.elems.length)
            return false;
        this[0] = this.elems[this.i][0];
        this[1] = this.elems[this.i][1];
        this.i++;
        return true;
    }
}
class NativeIteratorWrapper {
    it;
    constructor(it) {
        this.it = it;
    }
    set;
    i = 0;
    [0];
    [1];
    next() {
        const { value, done } = this.it.next();
        if (done)
            return false;
        this[0] = value;
        return true;
    }
}
function isArray(obj) {
    return obj && Array.isArray(obj);
}
function isObj(obj) {
    return obj && typeof obj === "object";
}
export function IT(set, arity) {
    if (set && typeof set.tonyuIterator === "function") {
        // TODO: the prototype of class having tonyuIterator will iterate infinitively
        return set.tonyuIterator(arity);
    }
    else if (isArray(set)) {
        if (arity == 1) {
            return new ArrayValueIterator(set);
        }
        else {
            return new ArrayKeyValueIterator(set);
        }
    }
    else if (set && typeof set[SYMIT] === "function") {
        return new NativeIteratorWrapper(set[SYMIT]());
    }
    else if (isObj(set)) {
        if (arity == 1) {
            return new ObjectKeyIterator(set);
        }
        else {
            return new ObjectKeyValueIterator(set);
        }
    }
    else {
        console.log(set);
        throw new Error(set + " is not iterable");
    }
}
export function IT2(set, arity) {
    const it = IT(set, arity);
    return function* () {
        while (it.next()) {
            const yielded = [];
            for (let i = 0; i < arity; i++) {
                yielded[i] = it[i];
            }
            yield yielded;
        }
    }();
}
//	module.exports=IT;
//   Tonyu.iterator=IT;
//	return IT;
//});
//# sourceMappingURL=TonyuIterator.js.map