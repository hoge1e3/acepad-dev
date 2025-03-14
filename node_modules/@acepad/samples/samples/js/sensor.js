#!run
import {show} from "@acepad/widget";
import {generator} from "@hoge1e3/dom";
export function main(){
    let accel={};
    function motion(evt){
        accel=evt.accelerationIncludingGravity;
        w.print(t.div({id:"acl"},
        accel.x,
        accel.y,
        accel.z,));
    }
    function setupSensor() {
        if (!window.DeviceMotionEvent) return afterSetup();
        if (!window.DeviceMotionEvent.requestPermission) return afterSetup();
        window.DeviceMotionEvent.requestPermission().
        then(afterSetup, function (e){
            window.alert(e);  
        });
    }
    function afterSetup(){
        window.addEventListener("devicemotion",motion);
    }
    const w=show();
    const t=generator();
    w.print(t.button({
        onclick:setupSensor,
        style:`
            position:absolute;
            left:0;top:0; font-size:50px;
        `
    },"START"));
    
}
