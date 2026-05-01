import { SFile } from "@hoge1e3/sfile";
type SourceFileParam = FileBasedSourceFileParam | URLBasedSourceFileParam;
type FileBasedSourceFileParam = {
    file?: SFile;
    text?: string;
    sourceMap?: string;
};
type URLBasedSourceFileParam = {
    url: string;
};
export declare class SourceFile {
    url?: string;
    text?: string;
    file?: SFile;
    sourceMap?: string;
    functions: any;
    parent?: SourceFiles;
    constructor(text: string, sourceMap: string);
    constructor(params: SourceFileParam);
    saveAs(outf: SFile): Promise<void>;
    exec(): Promise<any>;
    export(): {
        text: string | undefined;
        sourceMap: string | undefined;
        functions: any;
    };
}
export declare class SourceFiles {
    url2SourceFile: Record<string, SourceFile>;
    constructor();
    add(text: string, sourceMap: string): SourceFile;
    add(params: SourceFileParam): SourceFile;
}
export declare const sourceFiles: SourceFiles;
export {};
