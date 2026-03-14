/*
How to run:
Press F7 and open index.html
Then Press F5
*/
import {createProxy} from "@acepad/worker";
import {sibling} from "@acepad/here";
import {sleep} from "@hoge1e3/timeout";
import {proxy} from "@hoge1e3/rpc";
const canvas = document.getElementById("lifeCanvas");
const offscreen = canvas.transferControlToOffscreen();

// Worker 作成
const worker = await createProxy(sibling(
    import.meta.url,
    "worker.js"));
//await sleep(1000);
// OffscreenCanvas を Worker に渡す
await worker.init(proxy.transfer(offscreen));
//  postMessage({ canvas: offscreen }, [offscreen]);
worker.start();
// ボタン制御
document.getElementById("startBtn").addEventListener("click", () => {
  worker.start();//postMessage({ type: "start" });
});
document.getElementById("stopBtn").addEventListener("click", () => {
  worker.stop();//postMessage({ type: "stop" });
});
document.getElementById("resetBtn").addEventListener("click", () => {
  worker.reset();//postMessage({ type: "reset" });
});