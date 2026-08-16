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
        _this.c=- 100;
        while (_this.x<2000) {
          Tonyu.checkLoop();
          _this.c+=20;
          if (_this.getkey("right")) {
            _this.x+=2;
          }
          _this.y+=Tonyu.globals.$touches[0].vy;
          _this.radius=16+_this.cos(Tonyu.globals.$frameCount*10)*3;
          if (_this.c>_this.y) {
            _this.c=0;
            new Tonyu.classes.user.Bullet({x: _this.x,y: _this.y});
            
          }
          if (Tonyu.globals.$frameCount%18==0) {
            new Tonyu.classes.user.Enemy({x: Tonyu.globals.$screenWidth,y: _this.rnd(Tonyu.globals.$screenHeight)});
            
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
        _this.c=- 100;
        while (_this.x<2000) {
          yield null;
          _this.c+=20;
          if (_this.getkey("right")) {
            _this.x+=2;
          }
          _this.y+=Tonyu.globals.$touches[0].vy;
          _this.radius=16+_this.cos(Tonyu.globals.$frameCount*10)*3;
          if (_this.c>_this.y) {
            _this.c=0;
            new Tonyu.classes.user.Bullet({x: _this.x,y: _this.y});
            
          }
          if (Tonyu.globals.$frameCount%18==0) {
            new Tonyu.classes.user.Enemy({x: Tonyu.globals.$screenWidth,y: _this.rnd(Tonyu.globals.$screenHeight)});
            
          }
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"c":{}}}
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
          _this.x+=10;
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
          _this.x+=10;
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
Tonyu.klass.define({
  fullName: 'user.Enemy',
  shortName: 'Enemy',
  namespace: 'user',
  superclass: Tonyu.classes.kernel.Actor,
  includes: [],
  methods: function (__superClass) {
    return {
      main :function _trc_Enemy_main() {
        var _this=this;
        
        _this.width=_this.height=25;
        _this.fillStyle="black";
        _this.vy=_this.rndFloat(- 10,10);
        while (true) {
          Tonyu.checkLoop();
          _this.x-=3;
          if (_this.screenOut()) {
            _this.die();
          }
          _this.b=_this.crashTo(Tonyu.classes.user.Bullet);
          if (_this.b) {
            _this.b.die();
            _this.die();
            
          }
          _this.vy+=0.5;
          _this.y+=_this.vy;
          _this.c=_this.clamped(_this.y,0,Tonyu.globals.$screenHeight);
          _this.y+=_this.c;
          if (_this.c) {
            _this.vy*=- 1;
          }
          _this.update();
          
        }
      },
      fiber$main :function* _trc_Enemy_f_main(_thread) {
        var _this=this;
        
        _this.width=_this.height=25;
        _this.fillStyle="black";
        _this.vy=_this.rndFloat(- 10,10);
        while (true) {
          yield null;
          _this.x-=3;
          if (_this.screenOut()) {
            _this.die();
          }
          _this.b=_this.crashTo(Tonyu.classes.user.Bullet);
          if (_this.b) {
            _this.b.die();
            _this.die();
            
          }
          _this.vy+=0.5;
          _this.y+=_this.vy;
          _this.c=_this.clamped(_this.y,0,Tonyu.globals.$screenHeight);
          _this.y+=_this.c;
          if (_this.c) {
            _this.vy*=- 1;
          }
          (yield* _this.fiber$update(_thread));
          
        }
        
      },
      __dummy: false
    };
  },
  decls: {"methods":{"main":{"nowait":false,"isMain":true,"vtype":{"params":[],"returnValue":null}}},"fields":{"vy":{},"b":{},"c":{}}}
});

});
export default Tonyu.classes.user;

//# sourceMappingURL=concat.js.map