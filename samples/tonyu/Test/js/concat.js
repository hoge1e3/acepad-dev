import {Tonyu} from "tonyu2-runtime";
if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"namespace":"user","esm":true,"_defaultSuperClass":"kernel.Actor","_dependingProjects":[{"namespace":"kernel"}]},"run":{"mainClass":"user.Main","_bootClass":"kernel.Boot","globals":{"$defaultFPS":60,"$imageSmoothingDisabled":true,"$soundLoadAndDecode":false}},"plugins":{},"kernelEditable":false,"language":"tonyu","version":1740040693405}, ()=>{
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        _this.t=(()=>(new Promise(((s)=>(setTimeout(s,100))))));
        for (_this.i=0; _this.i<10 ; _this.i++) {
          Tonyu.checkLoop();
          {
            console.log(2+_this.i);
            _this.t();
          }
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        _this.t=(()=>(new Promise(((s)=>(setTimeout(s,100))))));
        for (_this.i=0; _this.i<10 ; _this.i++) {
          yield null;
          {
            console.log(2+_this.i);
            (yield* _thread.await(_this.t()));
          }
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"t":{},"i":{}}}
});

});
export default Tonyu.classes.user;

//# sourceMappingURL=concat.js.map