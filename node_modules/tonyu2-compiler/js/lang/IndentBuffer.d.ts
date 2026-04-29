import SourceMap from "source-map";
import { Visitor } from "./Visitor.js";
import { SFile } from "@hoge1e3/sfile";
type SrcRCM = {
    getRC(n: number): {
        row: number;
        col: number;
    };
};
type Options = {
    fixLazyLength?: number;
    dstFile?: SFile;
    mapFile?: SFile;
    compress?: boolean;
};
export declare class IndentBuffer {
    options: Options;
    dstFile?: SFile;
    mapFile?: SFile;
    srcFile?: SFile;
    srcRCM?: SrcRCM;
    compress: boolean;
    useLengthPlace: boolean;
    lazyOverflow: boolean;
    constructor(options: Options);
    get printf(): (fmt: string, ...args: any[]) => void;
    _printf(fmt: string, ...args: any[]): void;
    visit(n: any): void;
    visitor?: Visitor;
    traceIndex: Record<string, number>;
    addTraceIndex(fname: string): void;
    addMapping(token: any): void;
    setSrcFile(f: SFile): void;
    print(v: any): void;
    buf: {
        append: (content: string) => void;
        replace: (index: number, replacement: string) => void;
        truncate: (length: number) => void;
        toString: () => string;
        getLength: () => number;
        last: (len: number) => string;
    };
    bufRow: number;
    bufCol: number;
    srcmap: SourceMap.SourceMapGenerator;
    lazy(place?: any): any;
    ln(): void;
    indent(): void;
    dedent(): void;
    toLiteral(s: string, quote?: string): string;
    indentBuf: string;
    indentStr: string;
    mapStr?: string;
    close(): string;
}
export {};
