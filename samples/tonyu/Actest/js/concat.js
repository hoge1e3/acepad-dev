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
        Tonyu.globals.$Screen.setBGColor("skyblue");
        while (_this.x<2000) {
          Tonyu.checkLoop();
          if (_this.getkey("right")) {
            _this.x+=2;
          }
          _this.y+=Tonyu.globals.$touches[0].vy;
          _this.radius=16+_this.cos(Tonyu.globals.$frameCount*10)*3;
          if (Tonyu.globals.$frameCount%8==0) {
            new Tonyu.classes.user.Bullet({x: _this.x,y: _this.y});
            
          }
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Main_f_main(_thread) {
        var _this=this;
        
        _this.x=_this.y=10;
        _this.fillStyle="white";
        _this.radius=20;
        Tonyu.globals.$Screen.setBGColor("skyblue");
        while (_this.x<2000) {
          yield null;
          if (_this.getkey("right")) {
            _this.x+=2;
          }
          _this.y+=Tonyu.globals.$touches[0].vy;
          _this.radius=16+_this.cos(Tonyu.globals.$frameCount*10)*3;
          if (Tonyu.globals.$frameCount%8==0) {
            new Tonyu.classes.user.Bullet({x: _this.x,y: _this.y});
            
          }
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{}}
});
Tonyu.klass.define({
  fullName: 'user.Bullet',
  shortName: 'Bullet',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Bullet_main() {
        var _this=this;
        
        _this.width=_this.height=10;
        _this.fillStyle="red";
        while (true) {
          Tonyu.checkLoop();
          _this.x+=5;
          if (_this.screenOut()) {
            _this.die();
          }
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Bullet_f_main(_thread) {
        var _this=this;
        
        _this.width=_this.height=10;
        _this.fillStyle="red";
        while (true) {
          yield null;
          _this.x+=5;
          if (_this.screenOut()) {
            _this.die();
          }
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