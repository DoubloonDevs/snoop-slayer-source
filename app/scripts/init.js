var gui = require('nw.gui');
var win = gui.Window.get();
win.setProgressBar(-1);
win.setPosition('center');
//win.showDevTools();

var fs = require('fs'),
    path = require('path'),
    https = require('https'),
    sys = require('util'),
    exec = require('child_process').exec;

var execPath = path.dirname( process.execPath );

var mod_dir = path.join(execPath, 'mods'),
    mod_dir_ls = fs.readdirSync(mod_dir);
    
fs.createReadStream(mod_dir + '/mods.js').pipe(fs.createWriteStream(main_dir + 'mods.js'));

var main_dir_index = global.module.filename,
    main_dir = main_dir_index.replace('/index.html', '/');

var canvas = document.getElementById('myCanvas'),
    c = canvas.getContext('2d'),
    build = "Beta 1.2.6";
    
canvas.width = 1280;
canvas.height = 720;

var resolution = "auto";

var width,
  height,
  fullscreen = 1,
  mouseX,
  mouseY,
  framecount = 0,
  low_res_mode = false,
  spooky_mode = false,
  scale = 1,
  mute = 0,
  mute_music = 0,
  boolean_particles = 0,
  shake = false,
  worldX = 0,
  time_null_input = 0,
  worldY = 0;

var game_start = true,
  game_over = false,
  game_paused = false,
  paused = 0,
  loaded = false,
  unlock_turret = false,
  turret_deployed = false,
  kills = 0;

var doritos_power = false,
  dew_power = false,
  diamond_power = false,
  sanic_power = false,
  weed_power = false;

var spawn_timer = 160,
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

var mouseDown = false,
  time_null_input = 0,
  mouseX = canvas.width / 2,
  mouseY = canvas.height / 2;

var upPressed = false,
  leftPressed = false,
  downPressed = false,
  rightPressed = false;

var dampening = 0.875;

var shake_scale = 0;

var showhitboxes = false,
  showfps = true;

var player,
  turrets = [],
  turrets_stored = 0,
  health_bar,
  drops = [],
  particles = [],
  enemies = [],
  bullets = [];

var alert_boss,
  alert_boss_deployed = false;

var gabechat;

var lastCalledTime;
var fps;
var delta;

Pace.on('done', function() {
  game_start = true;
  document.getElementById("pause_menu").style.visibility = 'visible';
});

function requestAnimFrame() {
  if (!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return;
  }
  delta = (new Date().getTime() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps = 1 / delta;
}

snooptrain.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);
