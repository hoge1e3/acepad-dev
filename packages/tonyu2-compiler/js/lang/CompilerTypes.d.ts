import { SFile } from "@hoge1e3/sfile";
import { Constructor, FieldInfo, Meta } from "../runtime/RuntimeTypes.js";
import { ScopeInfo } from "./compiler.js";
import { IndentBuffer } from "./IndentBuffer.js";
import { Expr, Expression, FuncDecl, FuncDeclHead, ParamDecl, Program, Stmt, SuperExpr, TNode, VarDecl } from "./NodeTypes.js";
import { Token } from "./parser.js";
export type C_MetaMap = {
    [key: string]: C_Meta;
};
export type BuilderContext = {
    classes: C_MetaMap;
    options: BuilderContextDef;
};
export type Aliases = {
    [key: string]: string;
};
export type BuilderEnv = {
    unresolvedVars: number;
    options: ProjectOptions;
    classes: C_MetaMap;
    aliases: Aliases;
};
export type RuntimeOptions = {
    bootClass: string;
};
export type ProjectOptions = {
    compiler: CompilerOptions;
    run: RuntimeOptions;
};
export type BuilderContextDef = {
    destinations?: Destinations;
};
export type DependencySpec = {
    namespace?: string;
    dir?: string;
    url?: string;
    outputFile?: SFile;
};
export type CompilerOptions = {
    namespace: string;
    dependingProjects: DependencySpec[];
    typeCheck?: boolean;
    outputFile?: string;
    defaultSuperClass?: string;
    field_strict?: boolean;
    external_waitable?: boolean;
    diagnose?: boolean;
    genAMD?: boolean;
    noLoopCheck?: boolean;
    compress?: boolean;
};
export type Destinations = FileDest | MemoryDest;
type FileDest = {
    file: any;
};
export declare function isFileDest(d: Destinations): d is FileDest;
type MemoryDest = {
    memory: true;
};
export declare function isMemoryDest(d: Destinations): d is MemoryDest;
export type Methods = {
    [key: string]: NonArrowFuncInfo;
};
export type Locals = {
    varDecls: {
        [key: string]: VarDecl;
    };
    subFuncDecls: {
        [key: string]: FuncDecl;
    };
};
export type C_FieldInfo = FieldInfo & {
    node?: TNode;
    pos?: number;
    resolvedType?: AnnotatedType;
};
export type C_NativeInfo = {};
export type C_AmdInfo = {};
export type C_Decls = {
    methods: {
        [key: string]: NonArrowFuncInfo;
    };
    fields: {
        [key: string]: C_FieldInfo;
    };
    natives: {
        [key: string]: C_NativeInfo;
    };
    amds: {
        [key: string]: C_AmdInfo;
    };
    softRefClasses: {
        [key: string]: ScopeInfo;
    };
};
export type C_Meta = Meta & {
    decls: C_Decls;
    superclass: C_Meta | null;
    includes: C_Meta[];
    src?: {
        tonyu?: SFile;
        js?: SFile | string;
        map?: string;
    };
    hasSemanticError?: boolean;
    jsNotUpToDate: boolean | undefined;
    directives: {
        field_strict?: boolean;
        external_waitable?: boolean;
    };
    node: Program;
    nodeTimestamp: number;
    annotation?: Record<string, NodeAnnotation>;
};
export type ScopeMap = {
    [key: string]: ScopeInfo;
};
export type FuncInfoBase = {
    klass: C_Meta;
    node?: FuncDecl;
    head?: FuncDeclHead;
    ftype?: string;
    isMain?: boolean;
    params?: ParamDecl[];
    scope?: ScopeMap;
    useArgs?: boolean;
    paramTypes?: (AnnotatedType | undefined)[];
    returnType?: AnnotatedType;
};
export type FuncInfo = NonArrowFuncInfo | ArrowFuncInfo;
export type NonArrowFuncInfo = FuncInfoBase & {
    name: string;
    stmts: Stmt[];
    locals?: Locals;
    nowait: boolean;
};
export declare function isNonArrowFuncInfo(f: FuncInfo): f is NonArrowFuncInfo;
export type ArrowFuncInfo = FuncInfoBase & {
    retVal: Expr;
    nowait: true;
};
export declare function isArrowFuncInfo(f: FuncInfo): f is ArrowFuncInfo;
export type NativeClass = {
    class: Constructor;
    sampleValue?: any;
};
export type MethodType = {
    method: NonArrowFuncInfo;
};
export type ArrayType = {
    element: AnnotatedType;
};
export type UnionType = {
    candidates: AnnotatedType[];
};
export type NamedType = NativeClass | C_Meta;
export type AnnotatedType = NamedType | MethodType | ArrayType | UnionType;
export declare function isArrayType(klass: AnnotatedType): klass is ArrayType;
export declare function isNativeClass(klass: AnnotatedType): klass is NativeClass;
export declare function isMeta(klass: AnnotatedType): klass is C_Meta;
export declare function isMethodType(klass: AnnotatedType): klass is MethodType;
export declare function isUnionType(klass: AnnotatedType): klass is UnionType;
export type NodeAnnotation = Annotation & {
    node: TNode;
};
export type Annotation = {
    scopeInfo?: ScopeInfo;
    funcInfo?: FuncInfo;
    declaringFunc?: FuncInfo;
    resolvedType?: AnnotatedType;
    fiberCall?: {
        N: Token;
        A: Expression[];
    } & ({
        type: "noRet";
    } | {
        type: "varDecl";
    } | {
        type: "ret";
        L: TNode;
        O: Token;
    } | {
        type: "noRetSuper";
        S: SuperExpr;
    } | {
        type: "retSuper";
        L: Expression;
        O: Token;
        S: SuperExpr;
    });
    otherFiberCall?: {
        fiberType?: MethodType;
        T: Expression;
        O: Expression;
        N: Token;
        A: Expression[];
    } & ({
        type: "varDecl";
    });
    myMethodCall?: {
        name: string;
        args: TNode[];
        scopeInfo: ScopeInfo;
    };
    othersMethodCall?: {
        target: TNode;
        name: string;
        args: TNode[];
    };
    memberAccess?: {
        target: TNode;
        name: string;
    };
    varInMain?: boolean;
    declaringClass?: C_Meta;
    noBind?: boolean;
    hasJump?: boolean;
};
export type TraceIndex = {};
export type GenOptions = {
    codeBuffer?: IndentBuffer;
    traceIndex?: TraceIndex;
};
export {};
