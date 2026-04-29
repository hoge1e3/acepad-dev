import { SFile, DirectoryOptions, Content } from "@hoge1e3/sfile";
type ProgressOptions = {
    progress?: (f: SFile) => Promise<any>;
};
type CreateZipOptions = DirectoryOptions & ProgressOptions;
type UnzipOptions = {
    onCheckFile?: (f: SFile, c: Content) => unknown;
    overwrite?: boolean;
    v?: boolean;
} & ProgressOptions;
type Status = {
    file: SFile;
    status: "uploaded" | "canceled";
    redirectedTo?: SFile;
};
export declare class zip {
    static zip(dir: SFile): Promise<void>;
    static zip(dir: SFile, options: CreateZipOptions): Promise<void>;
    static zip(dir: SFile, dstZip: SFile): Promise<void>;
    static zip(dir: SFile, dstZip: SFile, options: CreateZipOptions): Promise<void>;
    static unzip(source: ArrayBuffer | SFile, destDir: SFile, options?: UnzipOptions): Promise<{
        [key: string]: Status;
    }>;
}
export {};
