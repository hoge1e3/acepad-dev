interface ITonyuIterator {
    set: any;
    i: number;
    next(): boolean;
    [0]: any;
    [1]: any;
}
export declare function IT(set: any, arity: 1 | 2): ITonyuIterator;
export declare function IT2(set: any, arity: 1 | 2): Generator<any>;
export {};
