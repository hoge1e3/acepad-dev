#!run
/*global Plotly*/

import {show} from "@acepad/widget";
import {loadScriptTag} from "@hoge1e3/loadScript";
export async function main(){
  if(typeof Plotly==="undefined"){
    await loadScriptTag("https://cdn.plot.ly/plotly-2.29.1.min.js");
  }
  let w=show();
  plots(w.element,[
    (x)=>x**2,
    (x)=>Math.sin(x),
  ],{
    title:"Graph sample"
  });
  return ;
}

function plots(dom, funcs, {
    xmin = -10,
    xmax = 10,
    ymin = -10,
    ymax = 10,
    title = ""
} = {}) {

    // normalize funcs to array
    if (typeof funcs === "function") {
        funcs = [funcs];
    }

    // generate x values
    const steps = 1000;
    const dx = (xmax - xmin) / steps;
    const xs = [];
    for (let i = 0; i <= steps; i++) {
        xs.push(xmin + i * dx);
    }

    // build traces
    const traces = funcs.map((fn, index) => {
        const ys = xs.map(x => {
            try {
                return fn(x);
            } catch (e) {
                return NaN;
            }
        });

        return {
            x: xs,
            y: ys,
            mode: "lines",
            type: "scatter",
            name: fn.name || `f${index + 1}`
        };
    });

    const layout = {
        title,
        xaxis: {
            range: [xmin, xmax]
        },
        yaxis: {
            range: [ymin, ymax]
        }
    };

    Plotly.newPlot(dom, traces, layout);
}