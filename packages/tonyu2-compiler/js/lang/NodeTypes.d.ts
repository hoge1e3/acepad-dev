import { NodeBase, Token } from "./parser.js";
export type RegExpLike = {
    exec: RegExp["exec"];
    toString?: () => string;
};
export type Expression = Elem | Prefix | Postfix | Infix | Trifix;
export type Prefix = NodeBase & {
    type: "prefix";
    op: Token;
    right: Expression;
};
export declare function isPrefix(n: TNode): n is Prefix;
export type Postfix = NodeBase & {
    type: "postfix";
    left: Expression;
    op: TNode;
};
export declare function isPostfix(n: TNode): n is Postfix;
export type Infix = NodeBase & {
    type: "infix";
    left: Expression;
    op: Token;
    right: Expression;
};
export declare function isInfix(n: TNode): n is Infix;
export type Trifix = NodeBase & {
    type: "trifix";
    left: Expression;
    op1: Token;
    mid: Expression;
    op2: Token;
    right: Expression;
};
export declare function isTrifix(n: TNode): n is Trifix;
export type Expr = Expression;
export type ArrayElem = NodeBase & {
    type: "arrayElem";
    subscript: Expression;
};
export declare function isArrayElem(n: TNode): n is ArrayElem;
export type ArgList = NodeBase & {
    type: "argList";
    args: DottableExpression[];
};
export declare function isArgList(n: TNode): n is ArgList;
export type Member = NodeBase & {
    type: "member";
    name: Token;
};
export declare function isMember(n: TNode): n is Member;
export type ParenExpr = NodeBase & {
    type: "parenExpr";
    expr: Expression;
};
export declare function isParenExpr(n: TNode): n is ParenExpr;
export type VarAccess = NodeBase & {
    type: "varAccess";
    name: Token;
};
export declare function isVarAccess(n: TNode): n is VarAccess;
export type FuncExprArg = NodeBase & {
    type: "funcExprArg";
    obj: FuncExpr;
};
export declare function isFuncExprArg(n: TNode): n is FuncExprArg;
export type ObjlitArg = NodeBase & {
    type: "objlitArg";
    obj: Objlit;
};
export declare function isObjlitArg(n: TNode): n is ObjlitArg;
export type ObjOrFuncArg = ObjlitArg | FuncExprArg;
export type CallBody = Expression[];
export type Call = NodeBase & {
    type: "call";
    args: CallBody;
};
export declare function isCall(n: TNode): n is Call;
export type Scall = NodeBase & {
    type: "scall";
    args: CallBody;
};
export declare function isScall(n: TNode): n is Scall;
export type NewExpr = NodeBase & {
    type: "newExpr";
    klass: VarAccess;
    params: Call | null;
};
export declare function isNewExpr(n: TNode): n is NewExpr;
export type SuperExpr = NodeBase & {
    type: "superExpr";
    name: Token | null;
    params: Scall;
};
export declare function isSuperExpr(n: TNode): n is SuperExpr;
export type Elem = Token | ParenExpr | NewExpr | SuperExpr | FuncExpr | Objlit | Arylit | VarAccess;
export type StmtList = Stmt[];
export type Exprstmt = NodeBase & {
    type: "exprstmt";
    expr: Expr;
};
export declare function isExprstmt(n: TNode): n is Exprstmt;
export type Compound = NodeBase & {
    type: "compound";
    stmts: StmtList;
};
export declare function isCompound(n: TNode): n is Compound;
export type Return = NodeBase & {
    type: "return";
    value: Expr | null;
};
export declare function isReturn(n: TNode): n is Return;
export type If = NodeBase & {
    type: "if";
    cond: Expr;
    then: Stmt;
    _else: Stmt | null;
};
export declare function isIf(n: TNode): n is If;
export type Forin = NodeBase & {
    type: "forin";
    isVar: Token | null;
    vars: Token[];
    inof: Token;
    set: Expr;
};
export declare function isForin(n: TNode): n is Forin;
export type NormalFor = NodeBase & {
    type: "normalFor";
    init: Stmt;
    cond: Expr | null;
    next: Expr | null;
};
export declare function isNormalFor(n: TNode): n is NormalFor;
export type For = NodeBase & {
    type: "for";
    inFor: NormalFor | Forin;
    loop: Stmt;
};
export declare function isFor(n: TNode): n is For;
export type While = NodeBase & {
    type: "while";
    cond: Expr;
    loop: Stmt;
};
export declare function isWhile(n: TNode): n is While;
export type Do = NodeBase & {
    type: "do";
    loop: Stmt;
    cond: Expr;
};
export declare function isDo(n: TNode): n is Do;
export type Case = NodeBase & {
    type: "case";
    value: Expr;
    stmts: StmtList;
};
export declare function isCase(n: TNode): n is Case;
export type Default = NodeBase & {
    type: "default";
    stmts: StmtList;
};
export declare function isDefault(n: TNode): n is Default;
export type Switch = NodeBase & {
    type: "switch";
    value: Expr;
    cases: Case[];
    defs: Default | null;
};
export declare function isSwitch(n: TNode): n is Switch;
export type Break = NodeBase & {
    type: "break";
    brk: Token;
};
export declare function isBreak(n: TNode): n is Break;
export type Continue = NodeBase & {
    type: "continue";
    cont: Token;
};
export declare function isContinue(n: TNode): n is Continue;
export type Finally = NodeBase & {
    type: "finally";
    stmt: Stmt;
};
export declare function isFinally(n: TNode): n is Finally;
export type Catch = NodeBase & {
    type: "catch";
    name: Token;
    stmt: Stmt;
};
export declare function isCatch(n: TNode): n is Catch;
export type Catches = Catch | Finally;
export type Try = NodeBase & {
    type: "try";
    stmt: Stmt;
    catches: Catches[];
};
export declare function isTry(n: TNode): n is Try;
export type Throw = NodeBase & {
    type: "throw";
    ex: Expr;
};
export declare function isThrow(n: TNode): n is Throw;
export type TypeExpr = NamedTypeExpr | ArrayTypeExpr | UnionTypeExpr;
export type ArrayTypeExpr = NodeBase & {
    type: "arrayTypeExpr";
    element: TypeExpr;
};
export declare function isArrayTypeExpr(n: TNode): n is ArrayTypeExpr;
export type NamedTypeExpr = NodeBase & {
    type: "namedTypeExpr";
    name: Token;
};
export declare function isNamedTypeExpr(n: TNode): n is NamedTypeExpr;
export type UnionTypeExpr = NodeBase & {
    type: "unionTypeExpr";
    left: TypeExpr;
    right: TypeExpr;
};
export declare function isUnionTypeExpr(n: TNode): n is UnionTypeExpr;
export type TypeDecl = NodeBase & {
    type: "typeDecl";
    vtype: TypeExpr;
};
export declare function isTypeDecl(n: TNode): n is TypeDecl;
export type VarDecl = NodeBase & {
    type: "varDecl";
    name: Token;
    typeDecl: TypeDecl | null;
    value: Expr | null;
};
export declare function isVarDecl(n: TNode): n is VarDecl;
export type VarsDecl = NodeBase & {
    type: "varsDecl";
    declPrefix: Token;
    decls: VarDecl[];
};
export declare function isVarsDecl(n: TNode): n is VarsDecl;
export type ParamDecl = NodeBase & {
    type: "paramDecl";
    dot: Token | null;
    name: Token;
    typeDecl: TypeDecl | null;
};
export type DotExpr = NodeBase & {
    type: "dotExpr";
    expr: Expr;
};
export type DottableExpression = DotExpr | Expression;
export declare function isParamDecl(n: TNode): n is ParamDecl;
export type ParamDecls = NodeBase & {
    type: "paramDecls";
    params: ParamDecl[];
};
export declare function isParamDecls(n: TNode): n is ParamDecls;
export type SetterDecl = NodeBase & {
    type: "setterDecl";
    value: ParamDecl;
};
export declare function isSetterDecl(n: TNode): n is SetterDecl;
export type FuncDeclHead = NodeBase & {
    type: "funcDeclHead";
    nowait: Token | null;
    ftype: Token | null;
    name: Token;
    setter: SetterDecl | null;
    params: ParamDecls | null;
    rtype: TypeDecl | null;
};
export declare function isFuncDeclHead(n: TNode): n is FuncDeclHead;
export type FuncDecl = NodeBase & {
    type: "funcDecl";
    head: FuncDeclHead;
    body: Compound;
};
export declare function isFuncDecl(n: TNode): n is FuncDecl;
export type NativeDecl = NodeBase & {
    type: "nativeDecl";
    name: Token;
};
export declare function isNativeDecl(n: TNode): n is NativeDecl;
export type IfWait = NodeBase & {
    type: "ifWait";
    then: Stmt;
    _else: Stmt | null;
};
export declare function isIfWait(n: TNode): n is IfWait;
export type Empty = NodeBase & {
    type: "empty";
};
export declare function isEmpty(n: TNode): n is Empty;
export type Stmt = Return | If | For | While | Do | Break | Continue | Switch | IfWait | Try | Throw | NativeDecl | FuncDecl | Compound | Exprstmt | VarsDecl | Empty;
export type FuncExprHead = NodeBase & {
    type: "funcExprHead";
    name: Token | null;
    params: ParamDecls | null;
};
export declare function isFuncExprHead(n: TNode): n is FuncExprHead;
export declare function isFuncExprOrDecl(n: TNode): n is (FuncDecl | FuncExpr);
export type FuncExpr = NonArrowFuncExpr | ArrowFuncExpr;
export type NonArrowFuncExpr = NodeBase & {
    type: "nonArrowFuncExpr";
    head: FuncExprHead;
    body: Compound;
};
export type ArrowFuncExpr = NodeBase & {
    type: "arrowFuncExpr";
    head: FuncExprHead;
    retVal: Expr;
};
export declare function isNonArrowFuncExpr(n: TNode): n is NonArrowFuncExpr;
export declare function isArrowFuncExpr(n: TNode): n is ArrowFuncExpr;
export declare function isFuncExpr(n: TNode): n is FuncExpr;
export type JsonElem = NodeBase & {
    type: "jsonElem";
    key: Token;
    value: Expr | null;
};
export declare function isJsonElem(n: TNode): n is JsonElem;
export type Objlit = NodeBase & {
    type: "objlit";
    elems: JsonElem[];
};
export declare function isObjlit(n: TNode): n is Objlit;
export type Arylit = NodeBase & {
    type: "arylit";
    elems: DottableExpression[];
};
export declare function isArylit(n: TNode): n is Arylit;
export type Extends = NodeBase & {
    type: "extends";
    superclassName: Token;
};
export declare function isExtends(n: TNode): n is Extends;
export type Includes = NodeBase & {
    type: "includes";
    includeClassNames: Token[];
};
export declare function isIncludes(n: TNode): n is Includes;
export type Program = NodeBase & {
    type: "program";
    ext: Extends | null;
    incl: Includes | null;
    stmts: Stmt[];
};
export declare function isProgram(n: TNode): n is Program;
export type BackquoteText = Token & {
    type: "backquoteText";
};
export declare function isBackquoteText(n: TNode): n is BackquoteText;
export type BackquoteLiteral = NodeBase & {
    type: "backquoteLiteral";
    body: (BackquoteText | Expr)[];
};
export declare function isBackquoteLiteral(n: TNode): n is BackquoteLiteral;
export type TNode = ArrayElem | ArgList | Member | ParenExpr | VarAccess | FuncExprArg | ObjlitArg | Call | Scall | NewExpr | SuperExpr | Exprstmt | Compound | Return | If | Forin | NormalFor | For | While | Do | Case | Default | Switch | Break | Continue | Finally | Catch | Try | Throw | TypeExpr | TypeDecl | VarDecl | VarsDecl | ParamDecl | ParamDecls | SetterDecl | FuncDeclHead | FuncDecl | NativeDecl | IfWait | Empty | FuncExprHead | FuncExpr | JsonElem | Objlit | Arylit | Extends | Includes | Program | Expression | BackquoteLiteral;
