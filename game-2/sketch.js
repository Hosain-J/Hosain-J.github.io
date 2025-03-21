
// My Very First FPS Game
// Hosain Javadi
// Last Edit: March 20th, 2025
//
// Extra for Experts:
// I have made a 3d environment, and 3d objects for array that randomly generates after each object being destroyed. I also have added a camera and a crosshair attached to it.


let boxes = []; // Array
const maxBoxes = 4; // maximum number of the boxes at a time
const floorHeight = -200;// thegrid line location on vertical axis
let sensitivity_slider; // added a sensitivity to the camera
let sensitivity = 8;

// variables for the camera
let cam_x, cam_y, cam_z;
let cam_cx, cam_cy, cam_cz;
let pan, tilt;
let aim_rad;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // WEBGL for 3d envronment
  perspective(PI / 3, width / height, 0.1, 5000); // setting up a camera for first person field of view of 60 degree

  // camera's starting point
  cam_x = 0;
  cam_y = -floorHeight/4;
  cam_z = -500;
  pan = 0;// horizontally
  tilt = -0.4;//vertically rotations

  aim_rad = 5;//distace of the crosshair form the camera

  // sensetivity sliider
  sensitivity_slider = createSlider(1, 20, sensitivity);
  sensitivity_slider.position(10, 10);

  // used a while loop instead of for loop just to wriite lesser
  while (boxes.length < maxBoxes) {
    boxes.push(createBox());
  }

  updateCamCenter();
}

function draw() {
  background(0);
  lights();//default lighting

  //camera pos and dir
  camera(cam_x, cam_y, cam_z, cam_cx, cam_cy, cam_cz, 0, -1, 0);

  // controls first person view movement
  pan += radians(movedX) / sensitivity;
  tilt -= radians(movedY) / sensitivity;
  tilt = constrain(tilt, -PI / 2, PI / 2);// constrain is used to avoid flipping

  updateCamCenter();// recalculates the camera direction for the aim

  // position of grid lines as the floor. to give a 3d illusion.
  push();
  translate(0, floorHeight, 0);
  drawGrid();
  pop();

  // make and modify boxes
  for (let box of boxes) {
    push();
    translate(box.x, box.y, box.z);
    fill(150, 0, 0);
    stroke(255);
    boxPrimitive(box.size);
    pop();
  }

  // Draw crosshair
  drawCrosshair();

  sensitivity = sensitivity_slider.value();// straight forward, changes the sense..
}

function mouseClicked() {// function for shooting
  requestPointerLock();

  for (let i = boxes.length - 1; i >= 0; i--) {// when the player shoot a box
    if (isAimingAtBox(boxes[i])) {
      boxes.splice(i, 1);
      boxes.push(createBox());
      break;// I just want to replace the removed box
    }
  }
}

function createBox() { // object notation
  return {
    x: random(-200, 200),
    y: random(-100, 0),
    z: random(-200, 200),
    size: 40
  };
}

function updateCamCenter() {// basiically calculates the center of the camera for the aiming
  cam_cx = cam_x + cos(tilt) * sin(pan);
  cam_cy = cam_y + sin(tilt);
  cam_cz = cam_z + cos(tilt) * cos(pan);
}

function drawGrid() {// making grid lines for the flooring
  push();
  rotateX(HALF_PI);
  stroke(120);
  for (let i = -500; i <= 500; i += 50) {
    line(i, -500, i, 500);
    line(-500, i, 500, i);
  }
  pop();
}

function boxPrimitive(size) {// make the box, one input (size) make a square
  box(size);
}

function drawCrosshair() {// making the crosshair
  push();
  let crosshairDist = 50;
  let crosshairX = cam_x + crosshairDist * cos(tilt) * sin(pan);
  let crosshairY = cam_y + crosshairDist * sin(tilt);
  let crosshairZ = cam_z + crosshairDist * cos(tilt) * cos(pan);

  translate(crosshairX, crosshairY, crosshairZ);
  fill(255);
  noStroke();
  sphere(1.5);
  pop();
}

function isAimingAtBox(box) {// check if the player is hitting the box or not,
  // direction where camera is pointing, making a vector
  let aimVec = createVector(cam_cx - cam_x, cam_cy - cam_y, cam_cz - cam_z).normalize();
  // a vector from box to camera
  let toBoxVec = createVector(box.x - cam_x, box.y - cam_y, box.z - cam_z);

  // it makes triangle with box vec and cam vec and the distance between them, then if it's positive the box is in fornt of the camera
  let projection = aimVec.dot(toBoxVec);
  if (projection < 0) {return false;}

  // calculates the distance between cam vec and box vec, making a right triangle with cam vec, box vec and distance between them
  let closestDist = p5.Vector.sub(toBoxVec, aimVec.mult(projection)).mag();

  return closestDist < box.size / 2;// return true if the crosshair is in the box in simplest explanation
}

function windowResized() {// to resize the window because some how it bugs without it sometimes
  resizeCanvas(windowWidth, windowHeight);
}