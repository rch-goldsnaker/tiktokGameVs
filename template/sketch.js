var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Events = Matter.Events

var engine;
var world;
var circles = [];
var boundaries = [];
var circlesRight = [];

var ground;
var poseRaw;
var pose;
var contadorRight = 0;
var contadorLeft = 0;
var contadorDown = 10;

var marcadorRight = 0;
var marcadorLeft = 0;


// function preload(){
//   poseRaw = loadImage('https://picsum.photos/100');
// }

function setup() {
  createCanvas(window.innerWidth-3, window.innerHeight-3);
  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);
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
  boundaries.push(new Boundary(width/2.5,height/10,width*0.01,height/5, 0));
  boundaries.push(new Boundary(width/(1.66),height/10,width*0.01,height/5, 0));
  boundaries.push(new Boundary(width/2,height/5.3,width/5,width*0.01, 0));

  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    // console.log(pairs.length)
  });
  // pose = makeMaskedImage(poseRaw,1);
  rectMode(CENTER);

  setInterval(myTimer, 30000);
  
  setInterval(TimerDown,1000);
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
  contadorDown = 10;
}

function TimerDown(){
  contadorDown = contadorDown - 1
}

function Circle (x,y,r){
  var option = {
    frictionAir: 0.01,
    restitution: 1
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

    textAlign(CENTER);
    fill(0);
    drawMaskedImage(pose,pos.x,pos.y,this.r);
    text('hola como estan 🙂', pos.x, pos.y);
  }
  
}

function Boundary (x,y,w,h,a){
  var option = {
    friction: 0.3,
    restitution: 0.6,
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

function mouseDragged (){
  circles.push(new Circle(mouseX,mouseY,50));
  if(mouseX < width/2){
    contadorRight = contadorRight + 1;
  }else{
    contadorLeft = contadorLeft + 1;
  }
}

function makeMaskedImage(img, dir){
  const circleMask = createGraphics(img.width,img.height);
// fill a soft mask so we see the whole frame,

  const sz = min(img.width,img.height);
  const wRatio = img.width/sz;
  const hRatio = img.height/sz;
  
//hard circle mask
  circleMask.fill('rgba(0, 0, 0, 1)');
  circleMask.ellipse(
      (sz * wRatio) / 2 + (dir * ((sz  * wRatio - sz)/2))        ,
      (sz * hRatio) / 2 + (dir * ((sz  * hRatio - sz)/2))        ,
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
  background(175);
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

  text(circles.length, 100,100);   

  text(contadorRight,700,80)
  text(contadorLeft,850,80)
  text(contadorDown,100,150)

  text(marcadorLeft,850,60)
  text(marcadorRight,700,60)
}
