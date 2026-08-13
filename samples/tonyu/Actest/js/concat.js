import {Tonyu} from "tonyu2-runtime";
import * as __npm___hoge1e3_counter from '@hoge1e3/counter';
import "tonyu2-kernel";
if(!Tonyu.load)Tonyu.load=(_,f)=>f();
Tonyu.load({"compiler":{"namespace":"user","esm":true,"npmDependencies":{"@hoge1e3/counter":"^1.0.0"},"defaultSuperClass":"kernel.Actor","dependingProjects":[{"npm":"tonyu2-kernel"}]},"run":{"mainClass":"user.Main","bootClass":"kernel.Boot","globals":{"$defaultFPS":60,"$imageSmoothingDisabled":true,"$soundLoadAndDecode":false}},"plugins":{},"kernelEditable":false,"language":"tonyu","version":1740040693405}, ()=>{
Tonyu.klass.define({
  fullName: 'user.Main',
  shortName: 'Main',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Main_main() {
        var _this=this;
        
        _this.x=_this.y=10;
        _this.fillStyle="white";
        _this.radius=20;
        while (_this.x<200) {
          Tonyu.checkLoop();
          _this.x++;
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        _this.x=_this.y=10;
        _this.fillStyle="white";
        _this.radius=20;
        while (_this.x<200) {
          yield null;
          _this.x++;
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});

});
export default Tonyu.classes.user;

//# sourceMappingURL=concat.js.map