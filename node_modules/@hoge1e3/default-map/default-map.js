// @hoge1e3/default-map
export let DefaultMap=class extends Map{
    constructor(def){
        super();
        if(typeof def!=="function"){
            const v=def;
            def=()=>v;
        }
        this.def=def;
    }
    get(k){
        if(!this.has(k)){
            super.set(k,this.def(k));
        }
        return super.get(k);
    }
};
export default DefaultMap;
