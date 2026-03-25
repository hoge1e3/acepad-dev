#!run
import { SFile } from "@hoge1e3/sfile";
interface Shell {
    resolve(p: string): SFile;
}
export declare function main(this: Shell, js: string): Promise<string>;
export {};
