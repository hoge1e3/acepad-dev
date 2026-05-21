export declare class RawContext<T> {
    value: Partial<T>;
    clear(): void;
    enter(newval: Partial<T>, act: (ctx: RawContext<T>) => any): any;
}
export type Context<T> = RawContext<T> & T;
export declare function context<T>(): Context<T>;
