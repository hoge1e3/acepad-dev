import { DeclsInDefinition, TypeDigest } from "tonyu2-runtime";
import type { ParamDecl, TNode } from "./NodeTypes";
import { AnnotatedType, Annotation, C_FieldInfo, C_Meta, FuncInfo, NativeClass, NodeAnnotation, NonArrowFuncInfo } from "./CompilerTypes.js";
import { ParsedNode, Token } from "./parser.js";
type valueOf<T> = T[keyof T];
export declare function isBlockScopeDeclprefix(t: Token | null): boolean | null;
export declare function isNonBlockScopeDeclprefix(t: Token | null): boolean | null;
export declare const ScopeTypes: {
    readonly FIELD: "field";
    readonly METHOD: "method";
    readonly NATIVE: "native";
    readonly LOCAL: "local";
    readonly THVAR: "threadvar";
    readonly PROP: "property";
    readonly PARAM: "param";
    readonly GLOBAL: "global";
    readonly CLASS: "class";
    readonly MODULE: "module";
};
export declare namespace ScopeInfos {
    class LOCAL {
        declaringFunc: FuncInfo;
        isBlockScope: boolean;
        type: "local";
        constructor(declaringFunc: FuncInfo, isBlockScope: boolean);
    }
    class PARAM {
        declaringFunc: FuncInfo;
        type: "param";
        constructor(declaringFunc: FuncInfo);
    }
    class FIELD {
        klass: C_Meta;
        name: string;
        info: C_FieldInfo;
        type: "field";
        constructor(klass: C_Meta, name: string, info: C_FieldInfo);
    }
    class PROP {
        klass: string;
        name: string;
        type: "property";
        getter?: FuncInfo;
        setter?: FuncInfo;
        constructor(klass: string, name: string);
    }
    class METHOD {
        klass: string;
        name: string;
        info: NonArrowFuncInfo;
        type: "method";
        constructor(klass: string, name: string, info: NonArrowFuncInfo);
    }
    class THVAR {
        type: "threadvar";
    }
    class NATIVE {
        name: string;
        value: NativeClass;
        type: "native";
        constructor(name: string, value: NativeClass);
    }
    class CLASS {
        name: string;
        fullName: string;
        info: C_Meta;
        type: "class";
        constructor(name: string, fullName: string, info: C_Meta);
    }
    class GLOBAL {
        name: string;
        type: "global";
        constructor(name: string);
    }
    class MODULE {
        name: string;
        type: "module";
        constructor(name: string);
    }
    type ALL = (FIELD | METHOD | NATIVE | LOCAL | THVAR | PROP | PARAM | GLOBAL | CLASS | MODULE) & {
        resolvedType?: AnnotatedType;
    };
}
export type ScopeInfo = ScopeInfos.ALL;
export type ScopeType = valueOf<typeof ScopeTypes>;
export declare function getScopeType(st: ScopeInfo): "class" | "method" | "field" | "native" | "local" | "threadvar" | "property" | "param" | "global" | "module" | null;
export declare function newScope<T extends object>(s: T): T;
export declare function nullCheck(o: any, mesg: string): any;
export declare function genSym(prefix: string): string;
export declare function annotation(aobjs: Record<string, NodeAnnotation>, node: ParsedNode, aobj?: Partial<Annotation> | undefined): NodeAnnotation;
export declare function packAnnotation(aobjs: Record<string, NodeAnnotation>): void;
export declare function getSource(srcCont: string, node: TNode): string;
export declare function resolvedType2Digest(t: AnnotatedType): TypeDigest;
export declare function digestDecls(klass: C_Meta): DeclsInDefinition;
export declare function typeDigest2ResolvedType(d: TypeDigest): AnnotatedType | undefined;
export declare function getField(klass: C_Meta, name: string): C_FieldInfo | null | undefined;
export declare function getMethod(klass: C_Meta, name: string): NonArrowFuncInfo | undefined;
export declare function getProperty(klass: C_Meta, name: string): {
    setter?: FuncInfo;
    getter?: FuncInfo;
} | null;
export declare function getDependingClasses(klass: C_Meta): C_Meta[];
export declare function getParams(method: FuncInfo): ParamDecl[];
export {};
