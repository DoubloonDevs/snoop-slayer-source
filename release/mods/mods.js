var spr_shrek = new Image();
spr_shrek.src = 'http://purepng.com/public/uploads/large/purepng.com-shrek-headshrekcomputer-animatedfantasy-filmfairy-talebook-1701528653890wst9v.png';

var orbital_snoops = false;

function modLoop() {
  if (game_start) {
    if (!game_over && !game_paused) {
      modUpdate();
    }
    modDraw();
  }
}
setInterval(modLoop, 1000/60);

function modUpdate() {
	check_orbital_snoops();
}

function modDraw() {

}

function check_orbital_snoops() {
	if (orbital_snoops) {
		player.speed = 500;
		dampening = 0.99;
	}	else {
		dampening = 0.875;
	}
}

function customEnemy(x, y, w, h, s, eh, sprite) {
  this.x = x;
  this.y = y;
  this.hx = this.x;
  this.hy = this.y;
  this.velx = 0;
  this.vely = 0;
  this.width = w;
  this.height = h;
  this.speed = s;
  this.health = eh;
  this.angle = 0;
  this.alive = true;
  this.sprite = sprite;
  this.update = function() {
  	this.x += this.velx;
	  this.y += this.vely;
	  this.velx *= dampening;
	  this.vely *= dampening;
	  this.velx += Math.cos(this.angle) / this.speed;
	  this.vely += Math.sin(this.angle) / this.speed;
	  this.dx = player.x - (this.x);
	  this.dy = player.y - (this.y);
	  this.angle = Math.atan2(this.dy, this.dx);
	  if (this.health < 1) {
	    kills++;
	    this.alive = false;
	  }
  }
  this.display = function() {
  	c.fillStyle = 'rgba(255, 0, 0, 0.5)'
	c.save();
	c.scale(-1, -1);
	c.translate(-this.x, -this.y);
	if (this.behaviour != 'boss') c.rotate(this.angle);
	if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	c.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
	c.restore();
	c.save();
	c.scale(1, 1);
	c.translate(this.x, this.y);
	c.restore();
  }
}