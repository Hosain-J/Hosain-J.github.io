let model3D;
let cam;
let posX = 0, posY = 0, posZ = -150;
let rotX = 0, rotY = 0;

function preload() {
  model3D = loadModel('Colt.obj', true); // Load the 3D model with normalization
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  cam = createCamera();
  cam.setPosition(0, -100, 200);
  cam.lookAt(0, 0, 0);
  document.addEventListener('mousemove', mouseLook);
}

function draw() {
  background(200);
  debugMode(GRID, 10000);
  
  // Lights for better visualization
  directionalLight(155, 155, 155, 1, 1, -1);
  ambientLight(10);
  
  updateCamera();
  
  push();
  translate(cam.eyeX, cam.eyeY, cam.eyeZ); // Attach the gun to the camera
  rotateY(-rotY); // Rotate gun with camera
  rotateX(rotX);
  translate(70, 80, posZ); // Adjust gun's position relative to the camera
  rotateY(PI/1.8);
  rotateX(PI);
  scale(0.5); // Adjust scale if needed
  model(model3D);
  pop();
}

function updateCamera() {
  if (keyIsDown(87)) cam.move(0, 0, -5); // W key - move forward
  if (keyIsDown(83)) cam.move(0, 0, 5); // S key - move backward
  if (keyIsDown(65)) cam.move(-5, 0, 0); // A key - move left
  if (keyIsDown(68)) cam.move(5, 0, 0); // D key - move right
}

function mouseLook(event) {
  let sensitivity = 0.002;
  rotY += event.movementX * sensitivity; // Horizontal rotation
  rotX += event.movementY * sensitivity; // Vertical rotation
  cam.pan(event.movementX * -sensitivity);
  cam.tilt(event.movementY * sensitivity);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
