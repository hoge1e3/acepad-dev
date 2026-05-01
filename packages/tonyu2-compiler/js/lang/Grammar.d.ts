import { Parser, ParserContext } from "./parser.js";
export default function (context: ParserContext): ((name: string) => {
    alias(parser: Parser): Parser;
    ands(..._parsers: (Parser | string)[]): {
        ret(...args: (string | null)[]): Parser;
    };
    ors(..._parsers: (Parser | string)[]): Parser;
}) & {
    defs: {
        [key: string]: Parser;
    };
    get: (name: string) => Parser;
    buildTypes: () => void;
    checkFirstTbl: () => void;
};
