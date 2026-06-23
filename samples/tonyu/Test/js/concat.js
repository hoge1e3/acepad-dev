import {Tonyu} from "tonyu2-runtime";
globalThis.Tonyu=Tonyu;
if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"namespace":"user","_defaultSuperClass":"kernel.Actor","_dependingProjects":[{"namespace":"kernel"}]},"run":{"mainClass":"user.Main","_bootClass":"kernel.Boot","globals":{"$defaultFPS":60,"$imageSmoothingDisabled":true,"$soundLoadAndDecode":false}},"plugins":{},"kernelEditable":false,"language":"tonyu","version":1740040693405}, ()=>{
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        console.log(2+40);
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        console.log(2+40);
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});

});

//# sourceMappingURL=concat.js.map