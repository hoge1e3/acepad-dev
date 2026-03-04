
const timeout=(t)=>new Promise(s=>setTimeout(s,t));

export async function show(sx, sy, dx, dy, rw, rh) {
  // Loop over each pixel in the resolution grid
      const maxIteration = 100;
  for (let py = 0; py < rh; py++) {
    let y0 = sy + (dy - sy) * py / rh; // map pixel y to imaginary part
    const line=[];
    for (let px = 0; px < rw; px++) {
      let x0 = sx + (dx - sx) * px / rw; // map pixel x to real part

      let x = 0;
      let y = 0;
      let iteration = 0;
      
      while (x*x + y*y <= 4 && iteration < maxIteration) {
        let xtemp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = xtemp;
        iteration++;
      }
      //if(px%10==0)await timeout(0);
      
      // Send value to plot function, e.g., normalized or raw iteration count
      line.push(iteration / maxIteration);
    }
    this.plot(py, line);
    await timeout(0);
  }
}
