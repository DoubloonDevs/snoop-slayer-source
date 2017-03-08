var canvas = document.getElementById("myCanvas");
document.onkeydown = keyPressed;
function keyPressed(e) {
  e = e || window.event;
  if (e.keyCode == 87) upPressed = true;
  if (e.keyCode == 65) leftPressed = true;
  if (e.keyCode == 83) downPressed = true;
  if (e.keyCode == 68) rightPressed = true;
  time_null_input = 0;
  if (shake_scale > 0) shake_scale -= 30;
  if (shake_scale < 0) shake_scale = 0;
}
document.onkeyup = keyReleased;
function keyReleased(e) {
  e = e || window.event;
  if (e.keyCode == 87) upPressed = false;
  if (e.keyCode == 65) leftPressed = false;
  if (e.keyCode == 83) downPressed = false;
  if (e.keyCode == 68) rightPressed = false;
  if (e.keyCode == 27) paused++;
  if (e.keyCode == 82 && !game_paused)  {
    setup();
    game_start = true;
  }
  if (e.keyCode == 32 && kills > 49 && turrets_stored > 0) {
    turrets.push(new Turret(player.x, player.y, 65, 21));
    turrets_stored--;
  }
  if (e.keyCode == 77) mute++;
  if (e.keyCode == 223) {
    if (!paused) paused++; 
    win.showDevTools();
  }
}

document.onmousedown = mousePressed;
function mousePressed(e) {
  e = e || window.event;
  mouseDown = true;
}
document.onmouseup = mouseReleased;
function mouseReleased(e) {
  e = e || window.event;
  mouseDown = false;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  this.mouseX = mousePos.x;
  this.mouseY = mousePos.y;
}, true);
