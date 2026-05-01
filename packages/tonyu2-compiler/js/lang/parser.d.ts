import { RegExpLike } from "./NodeTypes.js";
export type And = {
    type: "and";
    elems: Parser[];
};
export type Or = {
    type: "or";
    elems: Parser[];
};
export type Rept = {
    type: "rept";
    elem: Parser;
};
export type Opt = {
    type: "opt";
    elem: Parser;
};
export type RetN = {
    type: "retN";
    index: number;
    elems: Parser[];
};
export type RetObj = {
    type: "object";
    fields: {
        [key: string]: number;
    };
    elems: Parser[];
};
export type Empty = {
    type: "empty";
};
export type Primitive = {
    type: "primitive";
    name: string;
};
export type Lazy = {
    type: "lazy";
    name: string;
};
export type Struct = And | Or | Rept | RetN | RetObj | Opt | Primitive | Lazy | Empty;
export declare const ALL: unique symbol;
export declare const SUBELEMENTS: unique symbol;
export type NodeRange = {
    pos: number;
    len: number;
};
export type NodeBase = {
    [SUBELEMENTS]?: ParsedNode[];
    pos: number;
    len: number;
};
export type Token = NodeBase & {
    type: string;
    text: string;
};
type SpaceSpec = Parser | "TOKEN" | "RAWSTR";
type FirstTbl = {
    [ALL]?: Parser;
} & {
    [key: string]: Parser;
};
type ParseFunc = (this: Parser, s: State) => State;
export declare class ParserContext {
    space: SpaceSpec;
    constructor(space: SpaceSpec);
    create(f: ParseFunc): Parser;
    lazy(pf: () => Parser): Parser;
    fromFirst(tbl: FirstTbl): Parser;
    fromFirstTokens(tbl: FirstTbl): Parser;
    empty(result: any[]): Parser;
}
type LazyInfo = {
    resolve: () => Parser;
    resolved?: Parser;
};
export declare class Parser {
    context: ParserContext;
    parse: (s: State) => State;
    struct?: Struct;
    name?: string;
    _first?: FirstTbl;
    _lazy?: LazyInfo;
    get isEmpty(): boolean;
    create(parserFunc: ParseFunc): Parser;
    constructor(context: ParserContext, parseFunc: ParseFunc);
    dispTbl(): void;
    except(f: Function): Parser;
    noFollow(p: Parser): Parser;
    andNoUnify(next: Parser): Parser;
    and(next: Parser): Parser;
    retNoUnify(f: Function): Parser;
    ret(next: Function): Parser;
    first(/*space:SpaceSpec,*/ ct: string): Parser;
    firstTokens(tokens: string | string[]): Parser;
    copyFirst(src: Parser): Parser;
    unifyFirst(other: Parser): Parser;
    or(other: Parser): Parser;
    structToArray(type: "and" | "or"): Parser[];
    orNoUnify(other: Parser): Parser;
    setAlias(p: Parser): this;
    setName(n: string, struct?: Struct | Parser): this;
    repNNoUnify(min: number): Parser;
    repN(min: number): Parser;
    rep0(): Parser;
    rep1(): Parser;
    optNoUnify(): Parser;
    opt(): Parser;
    sep1(sep: Parser, valuesToArray: boolean): Parser;
    sep0(s: Parser): Parser;
    tap(msg: string): this;
    retN(i: number): Parser;
    obj(...names: (string | null)[]): Parser;
    assign(a: object): Parser;
}
export type ParseError = string;
export type MaxErrors = {
    pos: number;
    errors: ParseError[];
};
export type TokenStateSrc = {
    tokens: Token[];
    maxErrors: MaxErrors;
    global?: any;
};
export type StrStateSrc = {
    str: string;
    maxErrors: MaxErrors;
    global?: any;
};
export type StateSrc = TokenStateSrc | StrStateSrc;
export type ParsedNode = any;
export declare class State {
    src: StateSrc;
    pos: number;
    result: ParsedNode[];
    get success(): boolean;
    _error?: ParseError;
    constructor(strOrTokens?: string | Token[], global?: any, cloneSrc?: State);
    clone(): State;
    errorSet: boolean;
    set error(error: ParseError | null);
    get error(): ParseError | null;
    isSuccess(): boolean;
    getGlobal(): any;
    withError(est: ParseError | null): State;
    toString(): string;
}
export type StrLikeResult = {
    pos: number;
    len: number;
    src: StrStateSrc;
};
export declare class StringParser {
    context: ParserContext;
    empty: Parser;
    fail: Parser;
    eof: Parser;
    constructor(context?: ParserContext);
    static withSpace(space: SpaceSpec): StringParser;
    create(pf: ParseFunc): Parser;
    str(st: string, name?: string): Parser;
    strLike(func: (str: string, pos: number, state?: State) => {
        len?: number;
        error?: string;
    }): Parser;
    reg(r: RegExpLike, name?: string): Parser;
    parse(parser: Parser, str: string, global?: any): State;
}
export declare const tokensParserContext: ParserContext;
export declare const TokensParser: {
    context: ParserContext;
    create(pf: ParseFunc): Parser;
    token(type: string): Parser;
    parse: (parser: Parser, tokens: any[], global?: any) => State;
    eof: Parser;
};
export declare function lazy(context: ParserContext, pf: () => Parser): Parser;
export declare function addRange(res: ParsedNode, newr: NodeRange | null): any;
export declare function setRange(res: any): any;
export declare function getRange(e: any): NodeRange | null;
export {};
