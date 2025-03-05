// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let fish; // initializing global variables
let bubbles = []; // the bubbles variable needed to be array because I will randomly spawn bubbles. the list is empty and I randomly insert bubbles to the list.

function setup() {
  createCanvas(windowWidth, windowHeight);
  fish = new Fish();
}

function draw() {
  background(30, 144, 255); // ocean like color
  
  fish.move();// fish is a class so the function of move annd display is being called from class 'fish'
  fish.display();
  
  if (random(1) < 0.03) { // this if statement put a condition if the random number that is being pick is less than 0.03. the number is that small because the refresh rate of the website is a big number. which make the probablity of the bubbes being spawned still a lot.
    bubbles.push(new Bubble());// adds a bubble to the bubble list
  }
  
  for (let i = bubbles.length - 1; i >= 0; i--) { // the i-- thing I found it in overflow stack. it basically manages indexing problem becasue the fish eats a random bubble or a random bubble disapears at the top of the screen. the loop starts from the end to not miscalculate the indicies. 
    bubbles[i].move(); // it calls move and display function from class bubbles
    bubbles[i].display();
    
    if (fish.eats(bubbles[i])) { // calls out if fish is touching the bubble
      bubbles.splice(i, 1); // splice: remove the item from list in the exact index and 1 stands for how many item to remove
      fish.grow(); // calls the function from the class
      fish.openMouth();
    } else if (bubbles[i].isGone()) { // calls out ifthe bubble is disappears
      bubbles.splice(i, 1);
    }
  }
}

class Fish { // initializing in class variables
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 20;
    this.speed = 5;
    this.direction = 1;
    this.mouthOpen = false;
  }
  
  move() { // movement function. I didn't use else if because sometimes the user will press two different keys simultaneously
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.direction = -1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.direction = 1;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
    
    this.x = constrain(this.x, 0, width); // these lines put a frame that fish can not get out
    this.y = constrain(this.y, 0, height);
  }
  
  display() {
    fill(255, 165, 0);
    push();
    translate(this.x, this.y);
    scale(this.direction, 1); // flips the fish horizontally but keeps it vertically the same
    ellipse(0, 0, this.size, this.size / 2); // body
    triangle(-this.size / 2, 0, -this.size, -this.size / 12, -this.size, this.size / 12); //tail
    fill(0);
    ellipse(this.size / 4, -this.size / 6, this.size / 6, this.size / 6); // Eye
    fill(255);
    ellipse(this.size / 4 - 2, -this.size / 6 - 2, this.size / 12, this.size / 12); // Eye reflection
    fill(0);
    if (this.mouthOpen) {
      ellipse(this.size / 2, 0, this.size / 5, this.size / 5); //mouth
    } else {
      line(this.size / 2, -2, this.size / 2, 2);
    }
    pop();
  }
  
  eats(bubble) {
    let d = dist(this.x, this.y, bubble.x, bubble.y); // dist stands for distance between x1,y1 and x2,y2
    return d < this.size / 2 + bubble.size / 2; // return true if they're close enough
  }
  
  grow() {
    this.size += 2;
  }
  
  openMouth() {
    this.mouthOpen = true;
    setTimeout(() => this.mouthOpen = false, 200); // setTimeout sets a timer
  }
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height;
    this.size = random(10, 20);
    this.alpha = 255;
  }
  
  move() {
    this.y -= 2; // goes up by 2 px per frame
    if (this.y < 0) {
      this.alpha -= 5; // gradually the bubble fades
    }
  }
  
  display() {
    fill(173, 216, 230, this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
  
  isGone() {
    return this.alpha <= 0; // when alpha is less or equal 0 returns true which tells the program that the bubbles are faded. 
  }
}
