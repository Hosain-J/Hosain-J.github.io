let model3D;
let cam;
let posX = 0, posY = 0, posZ = 0;
let rotX = 0, rotY = 0;

function preload() {
  model3D = loadModel('Colt.obj', true); // Load the 3D model with normalization
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  cam = createCamera();
  cam.setPosition(0, 0, 200);
  cam.lookAt(0, 0, 0);
  document.addEventListener('mousemove', mouseLook);
}

function draw() {
  background(200);
  
  // Lights for better visualization
  directionalLight(255, 255, 255, 1, 1, -1);
  ambientLight(150);
  
  updateCamera();
  
  push();
  translate(posX, posY, posZ);
  rotateX(rotX);
  rotateY(rotY);
  scale(1.5); // Adjust scale if needed
  model(model3D);
  pop();
}

function updateCamera() {
  if (keyIsDown(87)) posZ -= 5; // W key - move forward
  if (keyIsDown(83)) posZ += 5; // S key - move backward
  if (keyIsDown(65)) posX -= 5; // A key - move left
  if (keyIsDown(68)) posX += 5; // D key - move right
}

function mouseLook(event) {
  let sensitivity = 0.002;
  rotY += event.movementX * sensitivity;
  rotX += event.movementY * sensitivity;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}