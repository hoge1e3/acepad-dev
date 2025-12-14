const f=require("./fuga.cjs");
setTimeout(()=>{
  const r=f.reqme(__filename);
  console.log("r.x",r.x);  
},1000);
exports.x=3;


