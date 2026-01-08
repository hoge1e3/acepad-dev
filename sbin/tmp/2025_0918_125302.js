#!run

export async function main(){
  return shouldAutoUpdate();
}
// 登録済みの許可IP一覧（サーバ側から生成して埋め込むのが安全）
const allowedIPs = [
  "203.0.113.45",   // 自宅Wi-Fi
  "198.51.100.20"   // 会社Wi-Fi
];

// Wi-Fiかどうか判定
async function shouldAutoUpdate() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  console.log("c",c?.type);
  // 1. Connection API があれば利用
  if (c) {
    if (c.type) {
      if (c.type === "wifi") return true;
      if (c.type === "cellular") return false;
    }
    if (c.effectiveType) {
      // effectiveTypeが "2g","3g","4g" → モバイルっぽい
      if (/^(2g|3g|4g|slow-2g)$/.test(c.effectiveType)) return false;
    }
  }

  // 2. フォールバック: IPベース判定
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    const ip = data.ip;
    console.log(ip);
    if (allowedIPs.includes(ip)) {
      return true; // 登録済みIP → 自動更新OK
    }
  } catch (e) {
    console.warn("IP判定失敗:", e);
  }

  // 3. それ以外は自動更新しない
  return false;
}

/*// 実際の利用
shouldAutoUpdate().then(auto => {
  if (auto) {
    startAutoUpdate();
  } else {
    showManualUpdateButton();
  }
});*/