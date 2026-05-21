import { SFile } from "@hoge1e3/sfile";
import { SrcMeta } from "./RuntimeTypes";
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
    klass?: SrcMeta;
    raise(): void;
};
export default function TError(message: string, src: SFile | string | SrcMeta, pos: number, len?: number): TError;
