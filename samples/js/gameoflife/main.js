import {create} from "@acepad/worker";
import {sibling} from "@acepad/here";
import {sleep} from "@hoge1e3/timeout";
const canvas = document.getElementById("lifeCanvas");
const offscreen = canvas.transferControlToOffscreen();

// Worker 作成
const worker = await create(sibling(
    import.meta.url,
    "worker.js"));
await sleep(1000);
// OffscreenCanvas を Worker に渡す
worker.postMessage({ canvas: offscreen }, [offscreen]);

// ボタン制御
document.getElementById("startBtn").addEventListener("click", () => {
  worker.postMessage({ type: "start" });
});
document.getElementById("stopBtn").addEventListener("click", () => {
  worker.postMessage({ type: "stop" });
});
document.getElementById("resetBtn").addEventListener("click", () => {
  worker.postMessage({ type: "reset" });
});