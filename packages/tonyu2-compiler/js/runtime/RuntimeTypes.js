export function isTonyuClass(v) {
    return typeof v === "function" && v.meta && !v.meta.isShim;
}
export function isArrayTypeDigest(d) {
    return d.element;
}
export function isUnionTypeDigest(d) {
    return d.union;
}
//# sourceMappingURL=RuntimeTypes.js.map