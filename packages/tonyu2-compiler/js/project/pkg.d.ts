import { SFile } from "@hoge1e3/sfile";
export declare class PackageJson {
    file: SFile;
    dir: SFile;
    obj: object;
    constructor(dir: SFile);
    save(): void;
    static find(path: string, origin: SFile): PackageJson | null;
}
