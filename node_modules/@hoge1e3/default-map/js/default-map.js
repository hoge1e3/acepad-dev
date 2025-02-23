export class DefaultMap extends Map {
    constructor(def, setEmpty = false) {
        super();
        this.setEmpty = setEmpty;
        if (typeof def === "function") {
            this.def = def;
        }
        else {
            const v = def;
            this.def = () => v;
        }
    }
    get(k) {
        if (!this.has(k)) {
            const r = this.def(k);
            if (this.setEmpty)
                super.set(k, r);
            return r;
        }
        return super.get(k);
    }
}
;
export default DefaultMap;
//# sourceMappingURL=default-map.js.map