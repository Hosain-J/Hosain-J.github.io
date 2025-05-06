let numberOfClicks=0;
let heighestNumberOfClicks=0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (getItem("highClick")) {
    heighestNumberOfClicks = getItem("highClick");
  }
}

function draw() {
  background(220);

  displayCclicks();
  displayHeightClicks();
}

function mousePressed(){
  numberOfClicks++;
  if (numberOfClicks>heighestNumberOfClicks){
    heighestNumberOfClicks=numberOfClicks;
    storeItem("highClick",heighestNumberOfClicks);
  }
}

function displayCclicks(){
  fill("black");
  textSize(50);
  textAlign(CENTER,CENTER);
  text(numberOfClicks,width/2,height/2);
}

function displayHeightClicks(){
  fill("green");
  textSize(50);
  textAlign(CENTER,CENTER);
  text(heighestNumberOfClicks,width/2,height/2-200);
}