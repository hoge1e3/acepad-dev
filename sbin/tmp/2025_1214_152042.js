#!run

export async function main(){
//  const r=await fetch("/pnode-bootkit/virtual/blob.txt");
//  return await r.text();
  //                     "http://localhost:3000/pnode-bootkit/virtual/blob.js"
  try {
    //hoge();
    const r=await import("http://localhost:3000/pnode-bootkit/virtual/blob.js");
    return r.default;
  } catch(e) {
    console.log(e);
    //main2();
  }
}

export async function main2(){
  const blob = new Blob(
    ["alert('Hello from Blob!'); export default 123;"],
    { type: "text/javascript" }
  );

  // SW スコープ内である必要がある
  const virtualPath = "virtual/blob.js";
  
  navigator.serviceWorker.ready.then(reg => {
    reg.active.postMessage({
      type: "REGISTER_BLOB",
      path: virtualPath,
      blob
    });
  });
  return ;
}