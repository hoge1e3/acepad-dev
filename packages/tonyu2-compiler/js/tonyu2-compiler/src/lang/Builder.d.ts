import { SourceFile } from "./SourceFiles.js";
import { BuilderContext, BuilderContextDef, BuilderEnv, C_Meta, C_MetaMap, GenOptions } from "./CompilerTypes.js";
import { DirBasedTonyuProject } from "../project/projectTypes.js";
import { SFile } from "@hoge1e3/sfile";
export default class Builder {
    prj: any;
    env: BuilderEnv | undefined;
    constructor(prj: DirBasedTonyuProject);
    isTonyu1(): any;
    getOptions(): any;
    getOutputFile(...f: SFile[]): any;
    getNamespace(): string;
    getDir(): any;
    getEXT(): any;
    sourceFiles(ns?: string): any;
    loadDependingClasses(ctx: BuilderContext): Promise<void>;
    getEnv(): BuilderEnv;
    initCtx(ctx: BuilderContext | BuilderContextDef): BuilderContext;
    requestRebuild(): void;
    getMyClasses(): C_Meta[];
    fileToClass(file: SFile): C_Meta | null;
    postChange(file: SFile): Promise<SourceFile>;
    reverseDependingClasses(klass: C_Meta): C_MetaMap;
    parse(f: SFile): import("./NodeTypes.js").Program;
    fileToShortClassName(f: SFile): string;
    addMetaFromFile(f: SFile): C_Meta;
    fullCompile(_ctx?: BuilderContext | BuilderContextDef): Promise<SourceFile>;
    partialCompile(compilingClasses: C_MetaMap, ctxOpt?: BuilderContextDef): Promise<SourceFile>;
    genJS(ord: C_Meta[], genOptions: GenOptions): Promise<void>;
    showProgress(m: string): void;
    renameClassName(o: string, n: string): Promise<SFile[]>;
    serializeAnnotatedNodes(): {
        [key: number]: any;
    };
}
