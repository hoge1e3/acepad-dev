export type RealDefFunc<K, V> = ((key: K) => V);
export type DefFunc<K, V> = V | RealDefFunc<K, V>;
export declare class DefaultMap<K, V> extends Map<K, V> {
    setEmpty: boolean;
    def: RealDefFunc<K, V>;
    constructor(def: DefFunc<K, V>, setEmpty?: boolean);
    get(k: K): V;
}
export default DefaultMap;
