#!run
/*global Plotly*/

import {showWidget} from "@acepad/widget";
import {loadScriptTag} from "@hoge1e3/loadScript";
export async function main(){
    await loadScriptTag("https://cdn.plot.ly/plotly-2.29.1.min.js");
    let w=showWidget("<div>");

    const xValues = Array.from({ length: 21 }, (_, i) => i - 10); // Generate x values from -10 to 10
    const yValues = xValues.map(x => x ** 2); // Compute y = x^2 for each x
    
    const trace = {
      x: xValues,
      y: yValues,
      mode: 'lines', // Plot as a line graph
      type: 'scatter', // Scatter plot with connected lines
      name: 'y = x^2',
    };
    
    const layout = {
      title: 'Graph of y = x^2',
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
    };

    Plotly.newPlot(w.element, [trace], layout);
    return ;
}
function plots(dom,funcs,{
    xmin,xmax,ymin,ymax,title}){
    
    // using Plotly
    // funcs either single function or Array of functions
    // min,max default values are -10,10
    
}