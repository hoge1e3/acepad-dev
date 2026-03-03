#!run
//Pisano period; period of fibonacci sequence modulo x
import {showWidget} from "@acepad/widget";
import {loadScriptTag} from "@hoge1e3/loadScript";

export async function main(){
  const xValues=[],yValues=[];
  let max=0;
    for(let i=2;i<1000;i++){
      const f=fibs(i);
      if(f.length>max){
        this.echo(i,f.length);
        max=f.length;
      }
      //  Math.round(f.length/(i**2)*10000)/100+"%");
      xValues.push(i);
      yValues.push(f.length);
      this.sleep(0.01);
    }
    plot(xValues,yValues);
}
export async function plot(xValues,yValues){
    await loadScriptTag("https://cdn.plot.ly/plotly-2.29.1.min.js");
    let w=showWidget("<div>");

   // const xValues = Array.from({ length: 21 }, (_, i) => i - 10); // Generate x values from -10 to 10
    //const yValues = xValues.map(x => x ** 2); // Compute y = x^2 for each x
    
    const trace = {
      x: xValues,
      y: yValues,
      mode: 'markers', // Plot as a line graph
      type: 'scatter', // Scatter plot with connected lines
      name: 'pisano',
      marker: { size: 2 }
    };
    
    const layout = {
      title: 'Pisano period',
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
    };

    Plotly.newPlot(w.element, [trace], layout);
    return ;
}

function fibs(m){
    let [a,b]=[1,1];
    let c=[];
    do{
        c.push(a);
        [a,b]=[b,(a+b)%m];
        //console.log(a,b);
        
    }while(a!=1||b!=1);
    return c;
}