// Nodes

let nodes=[];

function setup() {
  createCanvas(windowWidth, windowHeight);

  let somePoint = new MovingPoints(width/2,height/2);
  nodes.push(somePoint);
}

function draw() {
  background('black');

  //draw line
  for (let node of nodes){
    node.update();
    node.connectTo(nodes);
  }

  // draw circle
  for (let node of nodes){
    node.display();
  }
}

function mousePressed(){
  let somePoint = new MovingPoints(mouseX,mouseY);
  //push it
  nodes.push(somePoint);
}


class MovingPoints{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.speed=5;
    this.radius=15;
    this.timeX=random(1000);
    this.timeY=random(1000);
    this.deltaTime=0.01;
    this.color=color(random(255),random(255),random(255));
    this.reach=100;
    this.maxRadius=100;
    this.minRadius=15;
  }

  display(){
    noStroke();
    fill(this.color);
    circle(this.x,this.y,this.radius);
  }

  update(){
    this.move();
    this.wrapAroundScreen();
    this.adjustSize();
  }

  adjustSize(){
    let mouseDistance=dist(mouseX,mouseY,this.x,this.y);
    if (mouseDistance<this.reach){
      let size=map(mouseDistance,0,this.reach,this.maxRadius,this.minRadius);
      this.radius=size;
    }
    else{
      this.radius=this.minRadius;
    }
  }

  connectTo(nodesArray){
    for (let otherNode of nodesArray){
      if (this !== otherNode){
        let distanceArray=dist(this.x,this.y,otherNode.x,otherNode.y);
        if (distanceArray<this.reach){
          stroke(this.color);
          line(this.x,this.y,otherNode.x,otherNode.y);
        }
      }
    }
  }

  move(){
    //perlin noise
    let dx = noise(this.timeX);
    let dy = noise(this.timeY);

    //scale speed
    dx=map(dx,0,1,-this.speed,this.speed);
    dy=map(dy,0,1,-this.speed,this.speed);

    this.x+=dx;
    this.y+=dy;

    this.timeX+=this.deltaTime;
    this.timeY+=this.deltaTime;

  }

  wrapAroundScreen(){
    if (this.x<0){
      this.x+=width;
    }
    if(this.x>width){
      this.x-=width;
    }
    if (this.y<0){
      this.y+=height;
    }
    if (this.y>height){
      this.y-=height;
    }
  }
}