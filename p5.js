#!p5
/*global createCanvas,background,fill,ellipse,
mouseX,mouseY,
*/
// p5.js setup function, runs once at the beginning
function setup() {
    createCanvas(400, 400);
    background(220);
}

// p5.js draw function, loops continuously
function draw() {
    fill(0);
    ellipse(mouseX, mouseY, 50, 50);
}