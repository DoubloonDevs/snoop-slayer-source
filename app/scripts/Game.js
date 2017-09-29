function setup() {
  canvas.width = 1280;
  canvas.height = 720;

  framecount = 0,
  low_res_mode = false,
  spooky_mode = false,
  shake = false,
  worldX = 0,
  worldY = 0;

  game_start = false,
  game_over = false,
  game_paused = false,
  paused = 0,
  loaded = false,
  unlock_turret = false,
  turret_deployed = false,
  kills = 0;

  doritos_power = false,
  dew_power = false,
  diamond_power = false,
  sanic_power = false,
  weed_power = false;

  spawn_timer = 160,
  spawn_time = 60,
  mountdew_timer = 2400,
  dew_power_timer = 0,
  health_timer = 1200,
  sanic_timer = 3000,
  sanic_power_timer = 0,
  diamond_timer = 1600,
  diamond_power_timer = 0,
  doritos_timer = 600,
  doritos_power_timer = 0,
  weed_timer = 1500,
  weed_power_timer = 0;

  mouseDown = false,
  time_null_input = 0,
  mouseX = canvas.width / 2,
  mouseY = canvas.height / 2;
  turrets = [],
  turrets_stored = 0,
  health_bar,
  drops = [],
  particles = [],
  enemies = [],
  bullets = [],
  alert_boss_deployed = false;
  sad_violin.pause();

  width = canvas.width;
  height = canvas.height;
  c.font = '13pt Comic Sans MS';
  player = new Player(200, 200, 85, 85);
  gabechat = new gabeChat(width - (260 / 1.25) - 15, height - (28 / 1.25));
  pl_health_bar = new HealthBar(0, 30, 55, 7);
  resize();
}
setup();

function gameLoop() {
  if (game_start) {
    if (!game_over && !game_paused) {
      update();
    }
    draw();
  }
}
setInterval(gameLoop, 1000/60);

function draw() {
  c.font = '13pt Comic Sans MS';
  scale = canvas.height / 720;
  c.save();
  c.scale(scale, scale);
  c.fillStyle = 'black';
  if (!weed_power) c.fillRect(0, 0, width, height);
  c.translate(worldX, worldY);
  if (spooky_mode) {
    c.drawImage(spooky_background, 0, 0, width, height);
  } else {
    c.drawImage(background, 0, 0, width, height);
  }

  for (var j = enemies.length - 1; j >= 0; j--) {
    var en = enemies[j];
    if (!game_over && !game_paused) en.update();
    en.display();
    if (!en.alive) enemies.splice(j, 1);
    if (en.behaviour != 'alert_boss') {
      var disX = player.x - en.x;
      var disY = player.y - en.y;
      if (Math.sqrt((disX * disX) + (disY * disY)) < player.width) {
        collisionBetween(en, player);
      }
    } else {
      collisionBetween(en, player);
    }
  }
  for (var i = bullets.length - 1; i >= 0; i--) {
    var b = bullets[i];
    if (!game_over && !game_paused) b.update();
    b.display();
    if (!b.alive) bullets.splice(i, 1);
  }
  for (var a = drops.length - 1; a >= 0; a--) {
    var d = drops[a];
    if (!game_over && !game_paused) d.update();
    d.display();
    if (!d.alive) drops.splice(a, 1);
  }
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.update();
    p.display();
    if (game_paused || game_over) {
      particles = [];
    }
    if (p.alive == false || particles.length > 20) {
      particles.splice(i, 1);
    }
  }
  for (var i = 0; i < turrets.length; i++) {
    var t = turrets[i];
    t.update();
    t.display();
    if (t.alive == false) {
      turrets.splice(i, 1);
    }
  }
  player.display();

  c.fillStyle = 'rgb(0, 0, 0)';
  c.fillText(build, 5 + 1, 20 + 1);
  if (showfps) c.fillText("fps : " + Math.floor(fps), 5 + 1, 35);
  c.fillText("Particles : " + particles.length, 5 + 1, 50);
  c.fillText("Bullets : " + bullets.length, 5 + 1, 65);
  c.fillText('Skrubs rekt : ' + kills, 5 + 1, 80);
  c.fillText('Snoops snooping : ' + enemies.length, 5 + 1, 95);
  c.fillText(Math.round(player.health) + "/10 -IGN", 5 + 1, 110);

  c.fillStyle = 'rgb(0, 0, 255)';
  c.fillText(build, 5, 20);
  c.fillStyle = 'rgb(0, 255, 0)';
  if (showfps) c.fillText("fps : " + Math.floor(fps), 5, 35);
  c.fillText("Particles : " + particles.length, 5, 50);
  c.fillText("Bullets : " + bullets.length, 5, 65);
  c.fillStyle = 'red';
  c.fillText('Skrubs rekt : ' + kills, 5, 80);
  c.fillText('Snoops snooping : ' + enemies.length, 5, 95);
  c.fillText(Math.round(player.health) + "/10 -IGN", 5, 110);

  pause_menu();

  gabechat.display();
  gabechat.update();
  mouseX = canvas.mouseX;
  mouseY = canvas.mouseY;
  if (game_start == false) {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, width, height);
  }
  c.restore();
  c.save();
  c.scale(scale, scale);
  if (game_start && !game_paused && !game_over) c.drawImage(spr_cursor, mouseX, mouseY, 25, 25);
  if (time_null_input > 500) {
    c.font = '42pt Comic Sans MS';
    c.textAlign = "center";
    c.fillStyle = '#000'
    c.fillText("stop camping", width / 2 + 2, height / 2 + 2);
    c.fillStyle = '#fff'
    c.fillText("stop camping", width / 2, height / 2);
  }
  c.restore();
}

function update() {
  requestAnimFrame();
  arrayCollision(bullets, enemies);
  handlePowerups();
  handleBosses();
  if (spawn_timer < 1) {
    if (!spooky_mode) enemies.push(new Enemy(random(200, width - 200), random(600, height - 600), 45, 45, 'enemy'));
    else enemies.push(new Enemy(random(200, width - 200), random(600, height - 600), 37, 45, 'spooky'));
    spawn_timer = spawn_time;
  }
  spawn_timer--;
  player.update();
  if (player.health < 0) {
    game_over = true;
    player.health = 0;
  }
  if (spawn_time > 5) spawn_time -= 0.002;
  if (kills == 50) {
    turrets_stored++;
    kills = 51;
  }
  if (kills % 175 === 0 && kills > 1) {
    kills++;
    turrets_stored++;
  }
  if (kills % 225 === 0 && !spooky_mode) {
    if (kills > 1 && kills > 225) spook(10000);
  }
  if (kills == 100) spook(10000), kills++;
  if (time_null_input > 500) {
    shake_scale += 0.5;
  }
  time_null_input++;
  framecount++;
}

function pause_menu() {
  // Visuals
  // Pause
  if (paused % 2 == 1 && !game_over) {
    game_paused = true;
    snooptrain.pause();
    gofast.pause();
    combo.pause();
    worldX = 0;
    worldY = 0;
    mouseDown = false;
  } else {
    game_paused = false;
    mouseX = canvas.mouseX;
    mouseY = canvas.mouseY;
    if (doritos_power && dew_power) combo.play();
    else if (sanic_power) gofast.play();
  }
  // Game Over
  if (game_over) {
    gofast.pause();
    combo.pause();
    snooptrain.pause();
    sad_violin.play();
    c.fillStyle = 'rgba(0, 0, 0, 0.25)';
    c.fillRect(width / 2 - 200, height/2 - 80, 400, 145);
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = '32pt Comic Sans MS';
    c.textAlign = "center";
    c.fillText("u rekt " + kills + " scrubs", width / 2, height / 2 - 30);
    c.fillText("1 skrub rekt u", width / 2, height / 2 + 16);
    c.font = '14pt Comic Sans MS';
    c.fillText("Press r to restart", width / 2, height / 2 + 43);
    mouseDown = false;
  }
  // CSS
  if (game_paused) {
    document.getElementById("pause_menu").style.display = 'block';
    canvas.style.cursor = 'default';
  } else {
    document.getElementById("pause_menu").style.display = 'none';
    canvas.style.cursor = 'none';
  }
  if (game_over) {
    restart.style.zIndex = 1;
    canvas.style.cursor = 'default';
  } else {
    restart.style.zIndex = -1;
  }
  if (mute % 2 == 1) {
    toggle_all.value = "Mute FX: ON";
  } else {
    toggle_all.value = "Mute FX: OFF";
  }
  if (mute_music % 2 == 1) {
    toggle_music.value = "Mute music: ON";
  } else {
    toggle_music.value = "Mute music: OFF";
  }
  if (win.isFullscreen) {
    toggle_fullscreen.value = "Fullscreen: ON";
  } else {
    toggle_fullscreen.value = "Fullscreen: OFF";
  }

  // Settings
  if (mute % 2 == 1) {
    wow.muted = true;
    hit.muted = true;
    mario_up.muted = true;
    smash.muted = true;
    weed.muted = true;
  } else {
    wow.muted = false;
    hit.muted = false;
    mario_up.muted = false;
    smash.muted = false;
    weed.muted = false;
  }
  if (mute_music % 2 == 1) {
    snooptrain.muted = true;
    gofast.muted = true;
    combo.muted = true;
  } else {
    snooptrain.muted = false;
    gofast.muted = false;
    combo.muted = false;
  }
}

function gabeChat(x, y) {
  this.x = x;
  this.y = y;
  this.collapsed = false;
  this.pop_up_count = 0;
}
gabeChat.prototype.update = function() {
  if (kills >= 2 && kills < 25 && this.pop_up_count === 0 && !turret_deployed) {
    this.collapsed = false;
    if (chat.currentTime === 0) chat.play();
    c.textAlign = 'left';
    c.font = '8pt Tahoma';
    c.fillStyle = 'black';
    c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 170, 242 / 1.25, 43 / 1.25);
    c.fillText("So you think you can meme,", this.x + 45, this.y - 154);
    c.fillText("skrub?", this.x + 45, this.y - 143);
    if (kills >= 5) {
      c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 130, 242 / 1.25, 43 / 1.25);
      c.fillText("Prove yourself worthy by killing", this.x + 45, this.y - 114);
      c.fillText("these snoops.", this.x + 45, this.y - 103);
    }
    if (kills >= 10) {
      c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 90, 242 / 1.25, 43 / 1.25);
      c.fillText("Use the WASD keys to move", this.x + 45, this.y - 74);
      c.fillText("yo ass.", this.x + 45, this.y - 63);
    }
    if (kills >= 15) {
      c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 50, 242 / 1.25, 43 / 1.25);
      c.fillText("Be seeing you soon, ya wee", this.x + 45, this.y - 34);
      c.fillText("scrub.", this.x + 45, this.y - 23);
    }
  } else if (turrets_stored > 0) {
    this.collapsed = false;
    if (chat.currentTime === 0) chat.play();
    c.textAlign = 'left';
    c.font = '8pt Tahoma';
    c.fillStyle = 'black';
    c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 170, 242 / 1.25, 43 / 1.25);
    c.fillText("Press space to deplay a turret", this.x + 45, this.y - 154);
    c.fillText("you scrub-lord.", this.x + 45, this.y - 143);
  } else {
    this.collapsed = true;
    chat.currentTime = 0;
    chat.pause();
  }
};
gabeChat.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  if (this.collapsed == false) c.drawImage(spr_gabe_chat, 0, -255 / 1.25, 260 / 1.25, 285 / 1.25);
  else if (this.collapsed == true) c.drawImage(spr_gabe_chat_collapsed, 0, 0, 166 / 1.25, 28 / 1.25);
  c.restore();
};

function handleBosses() {
  if (framecount % Math.round(spawn_time * 13) == 1 && !alert_boss_deployed && kills >= 35) {
    enemies.push(new Enemy(width / 2, height / 2, 419, 120, 'alert_boss'));
    alert_boss_deployed = true;
  } else {
    alert_boss_deployed = false;
  }
}

function spook(frames) {
  var spawn_time_before = spawn_time;
  console.log(spawn_time_before);
  spooky_mode = true;
  setTimeout(function() {
    spooky_mode = false;
    spawn_time = spawn_time_before;
    console.log(spawn_time_before);
  }, frames);
  if (spooky_mode) {
    spawn_time = 5;
  }
}

function handlePowerups() {
  if (mouseDown) {
    if (!doritos_power && !dew_power && !sanic_power && !diamond_power && !weed_power) {
      bullets.push(new Bullet(player, 25, 15, "chicken", 20, 1));
    }
    if (doritos_power && dew_power || sanic_power) {
      snooptrain.pause();
    } else {
      snooptrain.play();
    }
    if (doritos_power == true && doritos_power_timer > 1) {
      bullets.push(new Bullet(player, 20, 20, "doritos", 10, 3));
      bullets.push(new Bullet(player, 10, 10, "doritos", 15, 3));
    }
    if (dew_power == true && dew_power_timer > 1) {
      bullets.push(new Bullet(player, 30, 15, "mountdew", 17, 2));
    }
    if (sanic_power == true && sanic_power_timer > 1) {
      player.speed = 140;
      bullets.push(new Bullet(player, 20, 20, "ring", 40, 3));
    }
    if (diamond_power == true && diamond_power_timer > 1) {
      bullets.push(new Bullet(player, 25, 25, "diamond", 15, 4));
    }
    if (weed_power == true && weed_power_timer > 1) {
      bullets.push(new Bullet(player, 25, 25, "weed", 8, 4));
    }
  }
  doritos_timer--;
  if (doritos_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 60, "doritos"));
    doritos_timer = 1600;
  }
  doritos_power_timer--;
  if (doritos_power_timer < 1) {
    doritos_power = false;
    combo.currentTime = 0;
    combo.pause();
  }
  mountdew_timer--;
  if (mountdew_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 35, "mountdew"));
    mountdew_timer = 1600 * 3;
  }
  dew_power_timer--;
  if (dew_power_timer < 1) {
    dew_power = false;
    combo.pause();
  }
  health_timer--;
  if (health_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 35, 45, "health"));
    health_timer = 1600;
  }
  sanic_timer--;
  if (sanic_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 86, 50, "sanic"));
    sanic_timer = 1600 * 4;
  }
  sanic_power_timer--;
  if (sanic_power_timer < 1) {
    gofast.pause();
    sanic_power = false;
    player.speed = 5;
  }
  diamond_timer--;
  if (diamond_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 40, 40, "diamond"));
    diamond_timer = 1600 * 5;
  }
  diamond_power_timer--;
  if (diamond_power_timer < 1) {
    diamond_power = false;
  }
  weed_timer--;
  if (weed_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 50, "weed"));
    weed_timer = 1600 * 3;
  }
  weed_power_timer--;
  if (weed_power_timer < 1) {
    weed_power = false;
  }
  if (sanic_power) {
    if (combo.currentTime === 0) {
      gofast.play();
    } else {
      gofast.pause();
    }
  } else {
    gofast.pause();
    gofast.currentTime = 0;
  }
  if (doritos_power && dew_power || sanic_power) {
    worldX += random(-20, 20);
    worldY += random(-20, 20);
  } else {
    worldX = random(-shake_scale, shake_scale);
    worldY = random(-shake_scale, shake_scale);
  }
  if (worldX < 0) worldX += 5;
  if (worldX > 0) worldX -= 5;
  if (worldY < 0) worldY += 5;
  if (worldY > 0) worldY -= 5;
}

function give_doritos(time) {
  doritos_power = true;
  doritos_power_timer = time;
  document.getElementById('hud').innerHTML += "<img id='equiped-doritos' src='img/spr_doritos_bag.png' style='width: 0vh;'>";
  setTimeout(function() {document.getElementById('equiped-doritos').style.width = 6.5 + 'vh';}, 100);
  setTimeout(function() {
    document.getElementById('equiped-doritos').style.width = 0 + 'vh';
    setTimeout(function() {document.getElementById('equiped-doritos').parentNode.removeChild(document.getElementById('equiped-doritos'));}, 500);
  }, doritos_power_timer*(1000/60));
}

function give_dew(time) {
  dew_power = true;
  dew_power_timer = time;
  document.getElementById('hud').innerHTML += "<img id='equiped-dew' src='img/spr_mountdew.png' style='width: 0vh;'>";
  setTimeout(function() {document.getElementById('equiped-dew').style.width = 12 + 'vh';}, 100);
  setTimeout(function() {
    document.getElementById('equiped-dew').style.width = 0 + 'vh';
    setTimeout(function() {document.getElementById('equiped-dew').parentNode.removeChild(document.getElementById('equiped-dew'));}, 500);
  }, dew_power_timer*(1000/60));
}

function give_sanic(time) {
  sanic_power = true;
  sanic_power_timer = time;
  document.getElementById('hud').innerHTML += "<img id='equiped-sanic' src='img/spr_sanic.png' style='width: 0vh;'>";
  setTimeout(function() {document.getElementById('equiped-sanic').style.width = 12 + 'vh';}, 100);
  setTimeout(function() {
    document.getElementById('equiped-sanic').style.width = 0 + 'vh';
    setTimeout(function() {document.getElementById('equiped-sanic').parentNode.removeChild(document.getElementById('equiped-sanic'));}, 500);
  }, sanic_power_timer*(1000/60));
}

function give_diamond(time) {
  diamond_power = true;
  diamond_power_timer = time;
  document.getElementById('hud').innerHTML += "<img id='equiped-diamond' src='img/spr_diamond_block.png' style='width: 0vh;'>";
  setTimeout(function() {document.getElementById('equiped-diamond').style.width = 8 + 'vh';}, 100);
  setTimeout(function() {
    document.getElementById('equiped-diamond').style.width = 0 + 'vh';
    setTimeout(function() {document.getElementById('equiped-diamond').parentNode.removeChild(document.getElementById('equiped-diamond'));}, 500);
  }, diamond_power_timer*(1000/60));
}

function give_weed(time) {
  weed_power = true;
  weed_power_timer = time;
  document.getElementById('hud').innerHTML += "<img id='equiped-weed' src='img/spr_weed_leaf.png' style='width: 0vh;'>";
  setTimeout(function() {document.getElementById('equiped-weed').style.width = 8 + 'vh';}, 100);
  setTimeout(function() {
    document.getElementById('equiped-weed').style.width = 0 + 'vh';
    setTimeout(function() {document.getElementById('equiped-weed').parentNode.removeChild(document.getElementById('equiped-weed'));}, 500);
  }, weed_power_timer*(1000/60));
}

function Player(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.hx = this.x;
  this.hy = this.y;
  this.velx = 0;
  this.vely = 0;
  this.width = w;
  this.height = h;
  this.speed = 5;
  this.angle = 0;
  this.kills = 0;
  this.health = 11;
  this.behaviour = 'player';
}
Player.prototype.control = function() {
  if (leftPressed && this.velx > -this.speed && this.x > this.width / 1.25) this.velx--;
  if (rightPressed && this.velx < this.speed && this.x < width - this.width / 1.25) this.velx++;
  if (upPressed && this.vely > -this.speed && this.y > this.height / 1.25) this.vely--;
  if (downPressed && this.vely < this.speed && this.y < height - this.height / 1.25) this.vely++;
};
Player.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= dampening;
  this.vely *= dampening;
  this.dx = mouseX - (this.x);
  this.dy = mouseY - (this.y);
  this.angle = Math.atan2(this.dy, this.dx);
  this.control();
  this.hx = this.x - (this.width / 2);
  this.hy = this.y - (this.height / 2);
  pl_health_bar.update();
};
Player.prototype.display = function() {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)';
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  c.drawImage(spr_player, -this.width / 2, -this.height / 2, this.width, this.height);
  pl_health_bar.display();
  c.restore();
};

function HealthBar(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.c_width = w;
  this.h_width = w;
  this.height = h;
}
HealthBar.prototype.update = function() {
  this.h_width = player.health * 5;
};
HealthBar.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  c.fillStyle = '#41C1E8';
  c.fillRect(-this.c_width / 2, 0, this.c_width, this.height);
  c.fillStyle = '#E85D41';
  c.fillRect(-(this.c_width / 2) - 1, -1, this.h_width + 2, this.height + 2);
  c.restore();
};

function Turret(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.health = 3400;
  this.dx = 0;
  this.dy = 0;
}
Turret.prototype.update = function() {
  if (!game_paused && !game_over) {
    bullets.push(new Bullet(this, 25, 15, "pringles", 20, 1));
  }
  if (0 < enemies.length) {
    for (var a, d = Number.MAX_VALUE, b = 0; b < enemies.length; b++) {
      var c = enemies[b],
          e = Math.pow(player.x - c.x, 2) + Math.pow(player.y - c.y, 2);
      e < d && (a = c, d = e)
    }
    this.dx = a.x - this.x;
    this.dy = a.y - this.y;
    this.angle = Math.atan2(this.dy, this.dx)
  }
  if (!game_paused) this.health--;
  if (this.health < 1) this.alive = false;
};
Turret.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  c.drawImage(spr_turret, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Drop(x, y, w, h, type) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.type = type;
  this.alive = true;
  this.types = ["doritos", "mountaindew", "health", "sanic", "diamond", "weed"];
}
Drop.prototype.update = function() {
  var disX = player.x - this.x;
  var disY = player.y - this.y;
  if (Math.sqrt((disX * disX) + (disY * disY)) < player.width) {
    if (this.type == "doritos") give_doritos(700);
    if (this.type == "mountdew") give_dew(700);
    if (this.type == "diamond") give_diamond(700);
    if (this.type == "weed") {
      give_weed(700);
      weed.play();
    }
    if (this.type == "health") {
      player.health = 11;
      mario_up.play();
    }
    if (this.type == "sanic") {
      give_sanic(700);
      snooptrain.pause();
    }
    if (doritos_power && dew_power) {
      combo.play();
      wow.play();
      gofast.pause();
      snooptrain.pause();
    } else {
      combo.pause();
      combo.currentTime = 0;
    }
    this.alive = false;
  }
};
Drop.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  if (this.type == "doritos") c.drawImage(spr_doritos_bag, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "mountdew") c.drawImage(spr_mountdew, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "health") c.drawImage(spr_health, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "sanic") c.drawImage(spr_sanic, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "diamond") c.drawImage(spr_diamond_block, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "weed") c.drawImage(spr_weed_leaf, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Particle(x, y, size, dither, type) {
  this.x = x;
  this.y = y;
  this.dither = dither;
  this.size = size;
  this.velx = Math.random() * (-dither - dither) + dither;
  this.vely = Math.random() * (-dither - dither) + dither;
  this.health = 15;
  this.type = type;
}
Particle.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= 0.875;
  this.vely += 0.3;
  this.health--;
  if (this.health < 1) {
    this.alive = false;
  }
};
Particle.prototype.display = function() {
  c.fillStyle = "rgba(51, 151, 255, 1)";
  if (this.type == 'hitmarker') c.drawImage(spr_hitmarker, this.x, this.y, 36 / 2, 36 / 2);
  if (this.type == 'adblock') c.drawImage(spr_adblock, this.x, this.y, 18, 18);
};

function Bullet(parent, w, h, type, s, d) {
  this.x = parent.x;
  this.y = parent.y;
  this.width = w;
  this.height = h;
  this.type = type;
  this.velx = (Math.cos(parent.angle) * s) + random(-d, d);
  this.vely = (Math.sin(parent.angle) * s) + random(-d, d);
  this.angle = parent.angle;
  this.health = 1;
  this.alive = true;
  this.behaviour = 'bullet';
}
Bullet.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  if (this.x > width || this.y > height || this.x <= 0 || this.y <= 0) this.alive = false;
};
Bullet.prototype.display = function() {
  c.fillStyle = 'black';
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (this.type == "chicken") c.drawImage(spr_chicken, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "doritos") c.drawImage(spr_doritos, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "pringles") c.drawImage(spr_pringle, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "mountdew") c.drawImage(spr_dew_can, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "ring") c.drawImage(spr_ring, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "diamond") c.drawImage(spr_diamond, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "weed") c.drawImage(spr_weed_bag, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Enemy(x, y, w, h, behaviour) {
  this.x = x;
  this.y = y;
  this.hx = this.x;
  this.hy = this.y;
  this.velx = 0;
  this.vely = 0;
  this.width = w;
  this.height = h;
  if (behaviour == 'alert_boss') {
    this.speed = 4;
    this.health = 350;
  }
  if (behaviour == 'enemy') {
    this.speed = 2;
    this.health = 15;
  }
  if (behaviour == 'spooky') {
    this.speed = 2;
    this.health = 7;
  }
  this.angle = 0;
  this.alive = true;
  this.behaviour = behaviour;
}
Enemy.prototype.update = function() {
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
};
Enemy.prototype.display = function() {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)'
  c.save();
  c.scale(-1, -1);
  c.translate(-this.x, -this.y);
  if (this.behaviour != 'alert_boss') c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  if (this.behaviour == 'enemy') {
    c.drawImage(spr_enemy, -this.width / 2, -this.height / 2, this.width, this.height);
  }
  if (this.behaviour == 'spooky') {
    c.drawImage(spr_spooky_enemy, -this.width / 2, -this.height / 2, this.width, this.height);
  }
  c.restore();
  c.save();
  c.scale(1, 1);
  c.translate(this.x, this.y);
  if (this.behaviour == 'alert_boss') {
    if (this.health >= 275) c.drawImage(spr_alert_boss_1, -this.width / 2, -this.height / 2, this.width, this.height);
    if (this.health >= 150 && this.health < 275) c.drawImage(spr_alert_boss_2, -this.width / 2, -this.height / 2, this.width, this.height);
    if (this.health < 150) c.drawImage(spr_alert_boss_3, -this.width / 2, -this.height / 2, this.width, this.height);
  }
  c.restore();
};

function arrayCollision(arrayA, arrayB) {
  for (var i = 1; i < arrayA.length; i++) {
    var this1 = arrayA[i];
    for (var j = 0; j < arrayB.length; j++) {
      var this2 = arrayB[j];
      if (this2.behaviour != 'alert_boss') {
        var disX = this2.x - this1.x;
        var disY = this2.y - this1.y;
        if (Math.sqrt((disX * disX) + (disY * disY)) < this1.width) {
          collisionBetween(this1, this2);
        }
      } else {
        collisionBetween(this1, this2);
      }
    }
  }
}

function collisionBetween(shapeA, shapeB) {
  var vX = (shapeA.x) - (shapeB.x),
    vY = (shapeA.y) - (shapeB.y),
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'hitmarker'));
    if (shapeB.behaviour == 'player') player.health -= 0.05;
    if (shapeA.behaviour == 'bullet') {
      shapeA.alive = false;
      if (shapeA.type == "pringles") {
        shapeB.health -= 1;
      } else {
        shapeB.health -= 2;
      }
      if (shapeB.behaviour == 'alert_boss' && boolean_particles % 2 == 0) {
        particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'adblock'));
      }
      if (!diamond_power) hit.play();
      else smash.play(), smash.currentTime = random(0, 5);
    }
    if (oX >= oY) {
      if (vY > 0) colDir = "t", shapeA.y += oY;
      else colDir = "b", shapeA.y -= oY;
    } else {
      if (vX > 0) colDir = "l", shapeA.x += oX;
      else colDir = "r", shapeA.x -= oX;
    }
  }
  return colDir;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function execute_code(code) {
  try {
    eval(code);
  }
  catch(err) {
    document.getElementById('console').placeholder += err.message+'\n';
    document.getElementById('console').value = '';
  }
}

function resize() {
  var w = Math.round(parseInt(resolution_select.value) * 1.77777777);
  var h = parseInt(resolution_select.value);

  win.width = w;
  win.height = h;
  
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight+ 'px';

  win.setPosition('center');
}
window.addEventListener('resize', resize, false);