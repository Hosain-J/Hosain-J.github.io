/* eslint-disable indent */
// Sierpinski Triangle Demo
// Recursion -- but visual!

let initialTriangle = [
  {x: 625, y: 50},
  {x: 50, y: 800},
  {x: 1200, y: 800}
];
let Thedepth =0;
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
}

function mousePressed() {
  if (Thedepth > 10) {
    Thedepth++;
    background(220);
    sierpinski(initialTriangle, Thedepth);
  }
}

function sierpinski(points, depth) {
  //shell triangle
  triangle(points[0].x, points[0].y,
           points[1].x, points[1].y,
           points[2].x, points[2].y,
  );

  //escape clause
  if (depth > -4) {
    //pattern -- draw the three new triangles
    sierpinski([midpoint(points[0], points[1]),
                points[1],
                midpoint(points[1], points[2])],
                depth - 1);
  
  sierpinski([midpoint(points[0], points[1]),
                points[0],
                midpoint(points[0], points[2])],
                depth - 1);
                
              sierpinski([midpoint(points[1], points[2]), 
                points[2],
                midpoint(points[0], points[2])],
                depth - 1); 
              }

}


function midpoint(point1, point2) {
  let midX = (point1.x + point2.x) / 2;
  let midY = (point1.y + point2.y) / 2;
  return {x: midX, y: midY};
}