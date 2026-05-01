type VisitF = (this: Visitor, node: N) => void;
type Funcs = {
    [key: string]: VisitF;
};
type N = any;
export declare class Visitor {
    funcs: Funcs;
    path: N[];
    debug: boolean;
    def?: VisitF;
    constructor(funcs: Funcs);
    visit(node: N): void;
    replace(node: N): void;
}
export {};
