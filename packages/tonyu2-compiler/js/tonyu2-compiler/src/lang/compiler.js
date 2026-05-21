import { Tonyu, isArrayTypeDigest, isUnionTypeDigest } from "tonyu2-runtime";
import { isMeta, isMethodType, isNativeClass, isUnionType } from "./CompilerTypes.js";
const NONBLOCKSCOPE_DECLPREFIX = "var";
export function isBlockScopeDeclprefix(t) {
    return t && t.text !== NONBLOCKSCOPE_DECLPREFIX;
}
export function isNonBlockScopeDeclprefix(t) {
    return t && t.text === NONBLOCKSCOPE_DECLPREFIX;
}
export const ScopeTypes = {
    FIELD: "field", METHOD: "method", NATIVE: "native", //B
    LOCAL: "local", THVAR: "threadvar", PROP: "property",
    PARAM: "param", GLOBAL: "global",
    CLASS: "class", MODULE: "module"
};
export var ScopeInfos;
(function (ScopeInfos) {
    class LOCAL {
        declaringFunc;
        isBlockScope;
        type = ScopeTypes.LOCAL;
        constructor(declaringFunc, isBlockScope) {
            this.declaringFunc = declaringFunc;
            this.isBlockScope = isBlockScope;
        }
    }
    ScopeInfos.LOCAL = LOCAL;
    class PARAM {
        declaringFunc;
        type = ScopeTypes.PARAM;
        constructor(declaringFunc) {
            this.declaringFunc = declaringFunc;
        }
    }
    ScopeInfos.PARAM = PARAM;
    class FIELD {
        klass;
        name;
        info;
        type = ScopeTypes.FIELD;
        constructor(klass, name, info) {
            this.klass = klass;
            this.name = name;
            this.info = info;
        }
    }
    ScopeInfos.FIELD = FIELD;
    class PROP {
        klass;
        name;
        type = ScopeTypes.PROP;
        getter;
        setter;
        constructor(klass, name) {
            this.klass = klass;
            this.name = name;
        }
    }
    ScopeInfos.PROP = PROP;
    class METHOD {
        klass;
        name;
        info;
        type = ScopeTypes.METHOD;
        constructor(klass, name, info) {
            this.klass = klass;
            this.name = name;
            this.info = info;
        }
    }
    ScopeInfos.METHOD = METHOD;
    class THVAR {
        type = ScopeTypes.THVAR;
    }
    ScopeInfos.THVAR = THVAR;
    class NATIVE {
        name;
        value;
        type = ScopeTypes.NATIVE;
        constructor(name, value) {
            this.name = name;
            this.value = value;
        }
    }
    ScopeInfos.NATIVE = NATIVE;
    class CLASS {
        name;
        fullName;
        info;
        type = ScopeTypes.CLASS;
        constructor(name, fullName, info) {
            this.name = name;
            this.fullName = fullName;
            this.info = info;
        }
    }
    ScopeInfos.CLASS = CLASS;
    class GLOBAL {
        name;
        type = ScopeTypes.GLOBAL;
        constructor(name) {
            this.name = name;
        }
    }
    ScopeInfos.GLOBAL = GLOBAL;
    class MODULE {
        name;
        type = ScopeTypes.MODULE;
        constructor(name) {
            this.name = name;
        }
    }
    ScopeInfos.MODULE = MODULE;
})(ScopeInfos || (ScopeInfos = {}));
;
let nodeIdSeq = 1;
let symSeq = 1; //B
//cu.newScopeType=genSt;
export function getScopeType(st) {
    return st ? st.type : null;
}
//cu.getScopeType=stype;
export function newScope(s) {
    return Object.create(s);
    /*const f=function (){};
    f.prototype=s;
    return (new f()) as T;*/
}
//cu.newScope=newScope;
export function nullCheck(o, mesg) {
    if (!o)
        throw mesg + " is null";
    return o;
}
//cu.nullCheck=nc;
export function genSym(prefix) {
    return prefix + ((symSeq++) + "").replace(/\./g, "");
}
//cu.genSym=genSym;
export function annotation(aobjs, node, aobj = undefined) {
    if (!node._id) {
        //if (!aobjs._idseq) aobjs._idseq=0;
        node._id = ++nodeIdSeq;
    }
    let res = aobjs[node._id];
    if (!res)
        res = aobjs[node._id] = { node };
    if (res.node !== node) {
        console.log("NOMATCH", res.node, node);
        throw new Error("annotation node not match!");
    }
    if (aobj) {
        Object.assign(res, aobj);
    }
    return res;
}
export function packAnnotation(aobjs) {
    if (!aobjs)
        return;
    function isEmptyAnnotation(a) {
        return a && typeof a === "object" && Object.keys(a).length === 1 && Object.keys(a)[0] === "node";
    }
    for (let k of Object.keys(aobjs)) {
        if (isEmptyAnnotation(aobjs[k]))
            delete aobjs[k];
    }
}
//cu.extend=extend;
/*function extend(res,aobj) {
    for (let i in aobj) res[i]=aobj[i];
    return res;
};*/
//cu.annotation=annotation3;
export function getSource(srcCont, node) {
    return srcCont.substring(node.pos, node.pos + node.len);
}
//cu.getSource=getSource;
//cu.getField=getField;
/*export function klass2name(t: AnnotatedType) {
    if (isMethodType(t)) {
        return `${t.method.klass.fullName}.${t.method.name}()`;
    } else if (isMeta(t)) {
        return t.fullName;
    } else if (isNativeClass(t)) {
        return t.class.name;
    } else {
        return `${klass2name(t.element)}[]`;
    }
}*/
export function resolvedType2Digest(t) {
    if (isMethodType(t)) {
        return `${t.method.klass.fullName}.${t.method.name}()`;
    }
    else if (isMeta(t)) {
        return t.fullName;
    }
    else if (isNativeClass(t)) {
        return t.class.name;
    }
    else if (isUnionType(t)) {
        return { candidates: t.candidates.map(resolvedType2Digest) };
    }
    else {
        return { element: resolvedType2Digest(t.element) };
    }
}
export function digestDecls(klass) {
    //console.log("DIGEST", klass.decls.methods);
    var res = { methods: {}, fields: {} };
    for (let i in klass.decls.methods) {
        const mi = klass.decls.methods[i];
        res.methods[i] = {
            nowait: !!mi.nowait,
            isMain: !!mi.isMain,
        };
        if (mi.paramTypes || mi.returnType) {
            res.methods[i].vtype = {
                params: mi.paramTypes ? mi.paramTypes.map((t) => t ? resolvedType2Digest(t) : null) : undefined,
                returnValue: mi.returnType ? resolvedType2Digest(mi.returnType) : null,
            };
        }
    }
    for (let i in klass.decls.fields) {
        const src = klass.decls.fields[i];
        const dst = {
            vtype: src.resolvedType ? resolvedType2Digest(src.resolvedType) : src.vtype
        };
        res.fields[i] = dst;
    }
    return res;
}
export function typeDigest2ResolvedType(d) {
    const root = globalThis;
    if (typeof d === "string") {
        if (Tonyu.classMetas[d]) {
            return Tonyu.classMetas[d];
        }
        else if (root[d]) {
            return { class: root[d] };
        }
    }
    else if (isArrayTypeDigest(d)) {
        const element = typeDigest2ResolvedType(d.element);
        return element ? { element } : undefined;
    }
    else if (isUnionTypeDigest(d)) {
        const candidates = d.candidates.map(typeDigest2ResolvedType).filter(e => !!e);
        if (candidates.length === d.candidates.length)
            return { candidates };
        return undefined;
    }
    return undefined;
}
export function getField(klass, name) {
    if (klass instanceof Function)
        return null;
    let res;
    for (let k of getDependingClasses(klass)) {
        //console.log("getField", k, name);
        if (res)
            break;
        res = k.decls.fields[name];
    }
    if (res && res.vtype && !res.resolvedType) {
        res.resolvedType = typeDigest2ResolvedType(res.vtype);
    }
    return res;
}
export function getMethod(klass, name) {
    let res;
    for (let k of getDependingClasses(klass)) {
        if (res)
            break;
        res = k.decls.methods[name];
    }
    return res;
}
export function getProperty(klass, name) {
    const getter = getMethod(klass, Tonyu.klass.property.methodFor("get", name));
    const setter = getMethod(klass, Tonyu.klass.property.methodFor("set", name));
    if (!getter && !setter)
        return null;
    return { getter, setter };
}
//cu.getMethod=getMethod2;
// includes klass itself
export function getDependingClasses(klass) {
    const visited = {};
    const res = [];
    function loop(k) {
        if (k.isShim) {
            console.log(klass, "contains shim ", k);
            throw new Error("Contains shim");
        }
        if (visited[k.fullName])
            return;
        visited[k.fullName] = true;
        res.push(k);
        if (k.superclass)
            loop(k.superclass);
        if (k.includes)
            k.includes.forEach(loop);
    }
    loop(klass);
    return res;
}
//cu.getDependingClasses=getDependingClasses;
export function getParams(method) {
    let res = [];
    if (!method.head)
        return res;
    if (method.head.setter)
        res.push(method.head.setter.value);
    const ps = method.head.params ? method.head.params.params : null;
    if (ps && !ps.forEach)
        throw new Error(method + " is not array ");
    if (ps)
        res = res.concat(ps);
    return res;
}
//cu.getParams=getParams;
//export= cu;
//# sourceMappingURL=compiler.js.map