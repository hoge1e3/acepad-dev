#!runts
import "http://cdnjs.com/libraries/stacktrace.js";
import { SFile } from "@hoge1e3/sfile";
interface Shell {
    resolve(p: string): SFile;
    run: Function;
}
export declare function main(this: Shell): Promise<void>;
export {};
