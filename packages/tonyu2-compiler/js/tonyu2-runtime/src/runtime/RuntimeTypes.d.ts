import { SFile } from "@hoge1e3/sfile";
export type MetaMap = {
    [key: string]: Meta;
};
export type ClassTreeRoot = {
    [key: string]: ClassTree;
};
export type ClassTree = {
    [key: string]: ClassTree;
} | TonyuClass;
export type TonyuMethod = Function & {
    fiber?: TonyuMethod;
    methodInfo?: MethodInfo;
};
export type Constructor = new (...args: any[]) => any;
export type Extender = (parent: TonyuShimClass | null, ctx: ClassDefinitionContext) => TonyuShimClass;
export type TonyuClass = Constructor & {
    meta: Meta;
    extendFrom: Extender;
};
export type TonyuShimClass = Constructor & {
    meta: ShimMeta;
    extendFrom: Extender;
};
export declare function isTonyuClass(v: any): v is TonyuClass;
export type TypeDigest = string | ArrayTypeDigest | UnionTypeDigest | null;
export type ArrayTypeDigest = {
    element: TypeDigest;
};
export type UnionTypeDigest = {
    candidates: TypeDigest[];
};
export declare function isArrayTypeDigest(d: TypeDigest): d is ArrayTypeDigest;
export declare function isUnionTypeDigest(d: TypeDigest): d is UnionTypeDigest;
export type MethodTypeDigest = {
    params?: TypeDigest[];
    returnValue?: TypeDigest;
};
export type MethodInfoInDefinition = {
    isMain?: boolean;
    nowait: boolean;
    vtype?: MethodTypeDigest;
};
export type MethodInfo = {
    klass: Meta;
    name: string;
} & MethodInfoInDefinition;
export type ShimMeta = Meta | {
    isShim: true;
    extenderFullName: string;
    func: TonyuShimClass;
};
export type FuncMap = {
    [key: string]: Function;
};
export type FuncMapFactory = (superclass: TonyuShimClass | null) => FuncMap;
export type ClassDefinition = {
    superclass: TonyuClass | null;
    includes: TonyuClass[];
    fullName: string;
    shortName: string;
    namespace: string;
    methods: FuncMapFactory | FuncMap;
    decls: {
        methods: {
            [key: string]: MethodInfo;
        };
        fields: {
            [key: string]: FieldInfo;
        };
    };
};
export type ClassDefinitionContext = {
    init: boolean;
    includesRec: {
        [key: string]: boolean;
    };
    nonShimParent: TonyuClass | null;
};
export type DeclsInDefinition = {
    methods: {
        [key: string]: MethodInfoInDefinition;
    };
    fields: {
        [key: string]: FieldInfoInDefinition;
    };
};
export type Decls = {
    methods: {
        [key: string]: MethodInfo;
    };
    fields: {
        [key: string]: FieldInfo;
    };
};
export type FieldInfoInDefinition = {
    vtype?: TypeDigest;
};
export type FieldInfo = {
    klass: Meta;
    name: string;
} & FieldInfoInDefinition;
export type Meta = {
    func: TonyuShimClass;
    fullName: string;
    shortName: string;
    namespace: string;
    decls: Decls;
    superclass: Meta | null;
    includesRec: {
        [key: string]: boolean;
    };
    includes: Meta[];
    builtin?: boolean;
};
export type SrcMeta = {
    src?: {
        tonyu?: SFile;
        js?: SFile | string;
        map?: string;
    };
} & Meta;
export type RuntimeOptions = {
    bootClass: string;
};
export type ProjectOptions = {
    compiler: CompilerOptions;
    run: RuntimeOptions;
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
