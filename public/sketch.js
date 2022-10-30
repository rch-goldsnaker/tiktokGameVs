var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Events = Matter.Events;
var Body = Matter.Body

var engine;
var world;
var circles = [];
var boundaries = [];
var boxRoses = [];
var boxTiktokes = [];
var circlesRight = [];

var ground;
var poseRaw;
var poseRaw2;
var pose;
var pose2;
var comment2;
var contadorRight = 0;
var contadorLeft = 0;
var contadorDown = 300;

var marcadorRight = 0;
var marcadorLeft = 0;
var puntero = 3;
var bg2;
var precio1;
var rosa;
var tikTokImage;
var precio2;
var gif_createImgRight;
var gif_createImgLeft;
var gif_createVs;


var contadorObjectLeft = 0;
var contadorObjectRight = 0;


function preload() {
  bg2 = loadImage('images/bg2.jpg');
  precio1 = loadImage('images/precios1.png');
  precio2 = loadImage('images/precios2.png');
  rosa = loadImage('images/rosa.png');
  tikTokImage = loadImage('images/tiktok.png');
  // gif_createImgRight = createImg("images/putin.gif");
  // gif_createImgLeft = createImg("images/bayden.gif");
  // gif_createVs = createImg("images/vs.gif");
}

function setup() {
  createCanvas(window.innerWidth-3, window.innerHeight-3);
  engine = Engine.create();
  world = engine.world;
  //Engine.run(engine);
  Matter.Runner.run(engine);
  var option = {
    isStatic : true
  }
  // boundaries.push(new Boundary(150,200,width*0.6,20, 0.3));
  // boundaries.push(new Boundary(250,300,width*0.6,20, -0.3));

  boundaries.push(new Boundary(width/2,0,width,width*0.02, 0));
  boundaries.push(new Boundary(width/2,height,width,width*0.02, 0));
  boundaries.push(new Boundary((width*0.01)/2,height/2,width*0.01,height, 0));
  boundaries.push(new Boundary(width,height/2,width*0.02,height, 0));
  boundaries.push(new Boundary(width/2,height/2,width*0.01,height, 0));
  //Marcador Izquierdo
  boundaries.push(new Boundary(width-width/20,height/10,width/12,width*0.1, 0));
  //Marcador Derecho
  boundaries.push(new Boundary(width/20,height/10,width/12,width*0.1, 0));
  //Marcador final
  boundaries.push(new Boundary(width/2,height/10,width/6,width*0.1, 0));
  //Contador Down.
  //boundaries.push(new Boundary(width/2,height/10,width/9,width*0.07, 0));

  // Events.on(engine, 'collisionStart', function(event) {
  //   var pairs = event.pairs;
  // });

  // boxRose.push(new boxRosse(100,100,50,50));
  rectMode(CENTER);

  //setInterval(myTimer, 300000);
  
  setInterval(TimerDown,1000);

  setInterval(timeControledLeft,1000);

  setInterval(timeControledRight,1000);

  setInterval(() => {
    Body.setVelocity(boxRoses[0].body, { x: 8, y: -15 });
    Body.setVelocity(boxTiktokes[0].body, { x: -8, y: -15 });
  }, 3000);

  boxRoses.push(new boxRosse(width/2-100,100,50,50));
  boxTiktokes.push(new boxTiktok(width/2+100,100,50,50));
}
function makeCircleLeft(){
  pose = makeMaskedImage(poseRaw,1);
  circles.push(new Circle(width/2-200,100,50,pose));
  contadorLeft = contadorLeft + 1;
  //arrayNewUsersLeft.shift();
}
function makeCircleRight(){
  pose2 = makeMaskedImage(poseRaw2,1);
  circles.push(new Circle(width/2+200,100,50,pose2));
  contadorRight = contadorRight + 1;
  //arrayNewUsersRight.shift();
}
function timeControledLeft(){
  if(contadorLeft<arrayNewUsersLeft.length){
    poseRaw = loadImage(arrayNewUsersLeft[contadorObjectLeft].picture,makeCircleLeft,failPictureLoad);
    contadorObjectLeft = contadorObjectLeft + 1;
  }
}
function timeControledRight(){
  if(contadorRight<arrayNewUsersRight.length){
    // console.log(arrayNewUsersRight.length)
    // console.log(contadorRight)
    poseRaw2 = loadImage(arrayNewUsersRight[contadorObjectRight].picture,makeCircleRight,failPictureLoad);
    contadorObjectRight = contadorObjectRight + 1;
  }
}

function  failPictureLoad() {
  console.log("this is a fail from picture load")
}

function myTimer() {
  for (var i = 0; i < circles.length; i++){
      circles[i].removeFromWorld();
      circles.splice(i,1);
      i--;
  }

  if (contadorRight>contadorLeft){
    marcadorRight = marcadorRight + 1;
  }else if(contadorRight<contadorLeft){
    marcadorLeft = marcadorLeft + 1;
  }else{
  }

  contadorRight = 0;
  contadorLeft = 0;
  contadorDown = 300;

  arrayNewUsersLeft.splice(0, arrayNewUsersLeft.length)
  contadorObjectLeft = 0;

  arrayNewUsersRight.splice(0, arrayNewUsersRight.length)
  contadorObjectRight = 0;

  arrayUserId.splice(0, arrayUserId.length)
}

function TimerDown(){
  contadorDown = contadorDown - 1
}

function Circle (x,y,r,pose,mensaje){
  var option = {
    frictionAir: 0,
    restitution: 1.01,
    friction: 0,
    frictionStatic: 0
  }
  this.r = r*2
  this.body = Bodies.circle(x,y,r,option);
  World.add(world,this.body);

  this.isOffScreen = function (){
    var pos = this.body.position;
    return (pos.y > height + 100)
  }

  this.removeFromWorld = function (){
    World.remove(world,this.body)
  }

  this.show = function(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(127);
    ellipse(0,0,this.r,this.r)
    pop();

    
    drawMaskedImage(pose,pos.x,pos.y,this.r);

    textAlign(CENTER);
    fill(255, 255, 255);
    textSize(20);
    text(mensaje, pos.x, pos.y);
  }
}

function Boundary (x,y,w,h,a){
  var option = {
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    angle: a,
    isStatic: true,

  }
  this.body = Bodies.rectangle(x,y,w,h,option);
  this.w = w;
  this.h = h;
  World.add(world,this.body);

  this.show = function(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    noStroke();
    fill(0);
    rect(0,0, this.w,this.h)
    pop();
    
  }
}

function boxRosse (x,y,w,h,a){
  var option = {
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    frictionAir: 0
  }
  this.body = Bodies.rectangle(x,y,w,h,option);
  this.w = w;
  this.h = h;
  World.add(world,this.body);

  this.show = function(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    noStroke();
    //fill(255);
    fill(255, 0, 255);
    //rect(0,0, this.w,this.h)
    pop();
    image(rosa,pos.x-50,pos.y-50,100,100)
  }
}

function boxTiktok (x,y,w,h,a){
  var option = {
    friction: 0,
    frictionStatic: 0,
    restitution: 1,
    frictionAir: 0
  }
  this.body = Bodies.rectangle(x,y,w,h,option);
  this.w = w;
  this.h = h;
  World.add(world,this.body);

  this.show = function(){
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    noStroke();
    //fill(255);
    fill(255, 0, 255);
    //rect(0,0, this.w,this.h)
    pop();
    image(tikTokImage,pos.x-50,pos.y-50,100,100)
  }
}

// function mousePressed (){
//   boxRoses.push(new boxRosse(width/2-100,100,50,50));
//   boxTiktokes.push(new boxTiktok(width/2+100,100,50,50));
// }


function makeMaskedImage(img, dir){
  const circleMask = createGraphics(img.width,img.height);

// fill a soft mask so we see the whole frame,

  const sz = min(img.width,img.height);
  const wRatio = img.width/sz;
  const hRatio = img.height/sz;
  
//hard circle mask
  circleMask.fill('rgba(0, 0, 0, 1)');
  circleMask.ellipse(
      (sz * wRatio) / 2 + (dir * ((sz  * wRatio - sz)/2)),
      (sz * hRatio) / 2 + (dir * ((sz  * hRatio - sz)/2)),
  sz);
  img.mask(circleMask);
return {img, wRatio, hRatio, dir};
}

function drawMaskedImage(maskedImg, cx, cy, sz ){  
  const {img, wRatio, hRatio, dir} = maskedImg;
  const trueWidth = sz * wRatio;
  const trueHeight =  sz * hRatio ;
  const xCenter = cx - (trueWidth/2);
  const yCenter = cy - (trueHeight/2)
  
  const xWiggle = ((trueWidth - sz) / 2) * dir;
  const yWiggle = ((trueHeight - sz) / 2) * dir;   
  image(img,xCenter - xWiggle,yCenter - yWiggle,trueWidth,trueHeight);   
}

function draw() {
  background(bg2);
  //circles.push(new Circle(100,20,random(5,10)));
  for (var i = 0; i < circles.length; i++){
    circles[i].show();
    
    if (circles[i].isOffScreen()){
      circles[i].removeFromWorld();
      circles.splice(i,1);
      i--;
    }    
  }

  for (var i = 0; i < boundaries.length; i++){
    boundaries[i].show();
  }

  for (var i = 0; i < boxRoses.length; i++){
    boxRoses[i].show();
  }

  for (var i = 0; i < boxTiktokes.length; i++){
    boxTiktokes[i].show();
  }
  textAlign(CENTER, CENTER);
  //Text up
  fill(255, 255, 255);
  textSize(60);
  text(marcadorLeft,70,90)
  text(contadorLeft,width/2-60,90)
  text(contadorRight,width/2+60,90)
  text(marcadorRight,width-70,90)

  //text center
  fill(255, 255, 255);
  textSize(20);
  //text(circles.length,width/2,height/2-60);   
  //text(arrayNewUsersLeft.length,width/2-80,height/2-60);
  //text(arrayNewUsersRight.length,width/2+80,height/2-60);

  fill(255, 255, 255);
  textSize(30);
  //text(contadorDown,width/2,50)

  //text(contadorLeft,width/2-80,height/2+60);
  //text(contadorRight,width/2+80,height/2+60);

  //gif_createImgRight.position(910, 180);
  //gif_createImgRight.size(400/3, 400/3);

  //gif_createImgLeft.position(500, 180);
  //gif_createImgLeft.size(400/3, 400/3);

  //gif_createVs.position(width/2-75,545);
  //gif_createVs.size(500/3, 288/3);

  //image(precio1,150,30,300,150)
  //image(precio2,1090,30,300,150)
}
