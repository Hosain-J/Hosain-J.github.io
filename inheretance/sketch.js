// inheretance

let shapes = [];




function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let color = [random(255), random(255), random(255)];
    shapes.push(new Shape(x, y, color));

    let choice = random(['circle', 'ellipse']);
    if (choice === 'circle') {
      let radius = random(10, 50);
      shapes.push(new Circle(x, y, color, radius));
    } 
    else {
      shapes.push(new Shape(x, y, color));
    }
  }
}

function draw() {
  background(220);
  for (let shape of shapes) {
    shape.display();
  }
}

class Shape {
  constructor(x,y,color){
    this.x = x;
    this.y = y;
    this.color = color;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, 30, 60);
  }
}

class Circle extends Shape {
  constructor(x,y,color,radius){
    super(x,y,color);
    this.radius = radius;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius*2);
  }
}