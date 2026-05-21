export function isFileDest(d) {
    return d.file;
}
export function isMemoryDest(d) {
    return d.memory;
}
export function isNonArrowFuncInfo(f) {
    return f.stmts;
}
export function isArrowFuncInfo(f) {
    return f.retVal;
}
export function isArrayType(klass) {
    return klass.element;
}
export function isNativeClass(klass) {
    return klass.class;
}
export function isMeta(klass) {
    return klass.decls;
}
export function isMethodType(klass) {
    return klass.method;
}
export function isUnionType(klass) {
    return klass.candidates;
}
//# sourceMappingURL=CompilerTypes.js.map