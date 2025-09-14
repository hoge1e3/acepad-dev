let ctx;
const width = 300;
const height = 300;
let current, next;
let running = false;
let intervalId = null;

// 初期化
function init() {
  current = new Uint8Array(width * height);
  next = new Uint8Array(width * height);

  // ランダム初期化
  for (let i = 0; i < current.length; i++) {
    current[i] = Math.random() > 0.8 ? 1 : 0;
  }
}

// 周囲の生存セルを数える（トーラス状）
function countNeighbors(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + width) % width;
      const ny = (y + dy + height) % height;
      count += current[ny * width + nx];
    }
  }
  return count;
}

// 世代更新
function step() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const neighbors = countNeighbors(x, y);
      const alive = current[idx];

      if (alive && (neighbors === 2 || neighbors === 3)) {
        next[idx] = 1;
      } else if (!alive && neighbors === 3) {
        next[idx] = 1;
      } else {
        next[idx] = 0;
      }
    }
  }

  // バッファ入れ替え
  [current, next] = [next, current];
}

// 描画
function draw() {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < current.length; i++) {
    const v = current[i] ? 255 : 0;
    const j = i * 4;
    data[j] = v;     // R
    data[j + 1] = v; // G
    data[j + 2] = v; // B
    data[j + 3] = 255; // A
  }

  ctx.putImageData(imageData, 0, 0);
}

// ループ
function loop() {
  if (!running) return;
  step();
  draw();
}

// メッセージ処理
onmessage = (e) => {
  //console.log("data");
  if (e.data.canvas) {
    const canvas = e.data.canvas;
    ctx = canvas.getContext("2d");
    init();
    draw();
  }

  if (e.data.type === "start") {
    if (!running) {
      running = true;
      intervalId = setInterval(loop, 50); // 20fps
    }
  }

  if (e.data.type === "stop") {
    running = false;
    if (intervalId) clearInterval(intervalId);
  }

  if (e.data.type === "reset") {
    init();
    draw();
  }
};