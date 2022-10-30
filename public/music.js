var x = document.getElementById("myAudio");

function enableLoop() { 
  x.loop = true;
  x.load();
} 

function disableLoop() { 
  x.loop = false;
  x.load();
} 

function checkLoop() { 
  alert(x.loop);
} 