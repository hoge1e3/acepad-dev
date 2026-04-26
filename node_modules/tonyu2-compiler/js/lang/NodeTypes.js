export function isPrefix(n) {
    return n.type == "prefix";
}
export function isPostfix(n) {
    return n.type == "postfix";
}
export function isInfix(n) {
    return n.type == "infix";
}
export function isTrifix(n) {
    return n.type == "trifix";
}
export function isArrayElem(n) {
    return n && n.type === "arrayElem";
}
export function isArgList(n) {
    return n && n.type === "argList";
}
export function isMember(n) {
    return n && n.type === "member";
}
export function isParenExpr(n) {
    return n && n.type === "parenExpr";
}
export function isVarAccess(n) {
    return n && n.type === "varAccess";
}
export function isFuncExprArg(n) {
    return n && n.type === "funcExprArg";
}
export function isObjlitArg(n) {
    return n && n.type === "objlitArg";
}
export function isCall(n) {
    return n && n.type === "call";
}
export function isScall(n) {
    return n && n.type === "scall";
}
export function isNewExpr(n) {
    return n && n.type === "newExpr";
}
export function isSuperExpr(n) {
    return n && n.type === "superExpr";
}
export function isExprstmt(n) {
    return n && n.type === "exprstmt";
}
export function isCompound(n) {
    return n && n.type === "compound";
}
export function isReturn(n) {
    return n && n.type === "return";
}
export function isIf(n) {
    return n && n.type === "if";
}
export function isForin(n) {
    return n && n.type === "forin";
}
export function isNormalFor(n) {
    return n && n.type === "normalFor";
}
export function isFor(n) {
    return n && n.type === "for";
}
export function isWhile(n) {
    return n && n.type === "while";
}
export function isDo(n) {
    return n && n.type === "do";
}
export function isCase(n) {
    return n && n.type === "case";
}
export function isDefault(n) {
    return n && n.type === "default";
}
export function isSwitch(n) {
    return n && n.type === "switch";
}
export function isBreak(n) {
    return n && n.type === "break";
}
export function isContinue(n) {
    return n && n.type === "continue";
}
export function isFinally(n) {
    return n && n.type === "finally";
}
export function isCatch(n) {
    return n && n.type === "catch";
}
export function isTry(n) {
    return n && n.type === "try";
}
export function isThrow(n) {
    return n && n.type === "throw";
}
export function isArrayTypeExpr(n) {
    return n && n.type === "arrayTypeExpr";
}
export function isNamedTypeExpr(n) {
    return n && n.type === "namedTypeExpr";
}
export function isUnionTypeExpr(n) {
    return n && n.type === "unionTypeExpr";
}
export function isTypeDecl(n) {
    return n && n.type === "typeDecl";
}
export function isVarDecl(n) {
    return n && n.type === "varDecl";
}
export function isVarsDecl(n) {
    return n && n.type === "varsDecl";
}
export function isParamDecl(n) {
    return n && n.type === "paramDecl";
}
export function isParamDecls(n) {
    return n && n.type === "paramDecls";
}
export function isSetterDecl(n) {
    return n && n.type === "setterDecl";
}
export function isFuncDeclHead(n) {
    return n && n.type === "funcDeclHead";
}
export function isFuncDecl(n) {
    return n && n.type === "funcDecl";
}
export function isNativeDecl(n) {
    return n && n.type === "nativeDecl";
}
export function isIfWait(n) {
    return n && n.type === "ifWait";
}
export function isEmpty(n) {
    return n && n.type === "empty";
}
export function isFuncExprHead(n) {
    return n && n.type === "funcExprHead";
}
export function isFuncExprOrDecl(n) {
    return isFuncExpr(n) || isFuncDecl(n);
}
export function isNonArrowFuncExpr(n) {
    return n && (n.type === "nonArrowFuncExpr");
}
export function isArrowFuncExpr(n) {
    return n && (n.type === "arrowFuncExpr");
}
export function isFuncExpr(n) {
    return isNonArrowFuncExpr(n) || isArrowFuncExpr(n);
}
export function isJsonElem(n) {
    return n && n.type === "jsonElem";
}
export function isObjlit(n) {
    return n && n.type === "objlit";
}
export function isArylit(n) {
    return n && n.type === "arylit";
}
export function isExtends(n) {
    return n && n.type === "extends";
}
export function isIncludes(n) {
    return n && n.type === "includes";
}
export function isProgram(n) {
    return n && n.type === "program";
}
export function isBackquoteText(n) {
    return n && n.type === "backquoteText";
}
;
export function isBackquoteLiteral(n) {
    return n && n.type === "backquoteLiteral";
}
//# sourceMappingURL=NodeTypes.js.map