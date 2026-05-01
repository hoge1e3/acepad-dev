import { SFile } from "@hoge1e3/sfile";
import { C_Meta } from "../lang/CompilerTypes.js";
export declare function isTError(e: any): e is TError;
export type TError = Error & {
    isTError: true;
    src: {
        path(): string;
        name(): string;
        text(): string;
    };
    pos: number;
    row: number;
    col: number;
    len: number;
    klass?: C_Meta;
    raise(): void;
};
export default function TError(message: string, src: SFile | string | C_Meta, pos: number, len?: number): TError;
