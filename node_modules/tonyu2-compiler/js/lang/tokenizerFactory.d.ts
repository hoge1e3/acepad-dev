import { State } from "./parser.js";
export type ReservedList = {
    [key: string]: boolean;
};
export type Tokenizer = {
    parse: (str: string) => State;
    extension: string;
    reserved: ReservedList;
};
export declare const BQH = "backquoteHead", BQT = "backquoteTail", BQX = "backquoteText";
export declare function tokenizerFactory({ reserved, caseInsensitive }: {
    reserved: ReservedList;
    caseInsensitive: boolean;
}): Tokenizer;
