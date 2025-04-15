// fire works demo

class Particle{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.dx=random(-5,5);
    this.dy=random(-5,5);
    this.radius=2;
    this.r=255;
    this.g=0;
    this.b=0;
    this.opacity=255;
  }

  display(){
    noStroke();
    fill(this.r,this.g,this.b,this.opacity);
    circle(this.x,this.y,this.radius);
  }

  update(){
    //move
    this.x+=this.dx;
    this.y+=this.dy;

    //fade
    this.opacity--;
  }

  isDead(){
    return this.opacity<=0;
  }
}

let fireWorks=[];
const number_of_fireWorks=150;


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for (let fireWork of fireWorks){
    if (fireWork.isDead()){
      let index=fireWorks.indexOf(fireWork);
      fireWorks.splice(index,1);
    }
    else{
      fireWork.update();
      fireWork.display();
    }
  }
}

function mousePressed(){
  for (let i=0;i<number_of_fireWorks;i++){
    let somefireWork = new Particle(mouseX,mouseY);
    fireWorks.push(somefireWork);
  }
}