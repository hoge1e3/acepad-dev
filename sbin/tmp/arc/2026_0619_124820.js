#!run

export async function main(...a){
  const [o,n]=this.pickOptions(a);
  const c=(o.s?
  `screen -S ${n}\n`:
  `screen -r ${n}\n`
  );
  return this.bauth({
    c
  });
}