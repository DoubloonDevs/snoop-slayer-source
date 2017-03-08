require('nw.gui').Window.get().setPosition('center');

var current_version = 121;
var version;
var version_checked = false;
var version_data_downloaded = false;
var download_files = false;
var progress = 0;
var online;
var connection_tested = false;

require('nw.gui').Window.get().showDevTools();

var gui = require('nw.gui');
var win = gui.Window.get();

var fs = require('fs'),
    path = require('path'),
    https = require('https'),
    sys = require('util'),
    exec = require('child_process').exec;

// Inject mod script
var execPath = path.dirname( process.execPath );

var mod_dir = path.join(execPath, 'mods'),
    mod_dir_ls = fs.readdirSync(mod_dir);
    
fs.createReadStream(mod_dir + '/mods.js').pipe(fs.createWriteStream(main_dir + 'mods.js'));

var main_dir_index = global.module.filename,
    main_dir = main_dir_index.replace('/load.html', '/');

// See if client is connected to the internet
function checkConnection() {
  var xhr = new XMLHttpRequest();
  var file = 'https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/download.DATA';
  var randomNum = Math.round(Math.random() * 10000);
 
  xhr.open('HEAD', file + "?rand=" + randomNum, true);
  xhr.send();
   
  xhr.addEventListener("readystatechange", processRequest, false);
 
  function processRequest(e) {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 304) {
        online = true;
        connection_tested = true;
        console.log('online!');
        download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/download.DATA', main_dir + 'download.DATA');
      } else {
        online = false;
        console.log('offline :(');
        progress = 1; // Start game if offline
      }
    }
  }
}
checkConnection();

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      version_data_downloaded = true;
      file.close(cb);  // close() is async, call cb after close completes.
      console.log('Download complete : ' + url);
      document.write('<html style="background: #333333"><h2 style="font-family: Courier New; color: #fff;">Download complete : ' + url + '</h2></html>');
      progress += 0.125;
      require('nw.gui').Window.get().setProgressBar(progress);
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

function loop() {
  if (online && connection_tested) {
    if (!version_checked) {
      if (version_data_downloaded) {
        version = fs.readFileSync('download.DATA', 'utf8');
        version_checked = true;
        progress = 0;
      }
    }
    if (version_checked) {
      if (current_version != version) {
        download_files = true;
      } else {
        download_files = false;
        progress = 1;
      }
    }
  }
  if (download_files) {
    if (progress < 1) {
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/init.js', main_dir + 'init.js');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/Game.js', main_dir + 'Game.js');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/ClientInput.js', main_dir + 'ClientInput.js');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/styles.css', main_dir + 'styles.css');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/LoadMedia.js', main_dir + 'LoadMedia.js');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/index.html', main_dir + 'index.html');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/package.json', main_dir + 'package.json');
      download('https://raw.githubusercontent.com/DoubloonDevs/SnoopSlayer/gh-pages/downloads/windows/package.json', main_dir + 'package.json');
      download_files = false;
    }
  }
  if (progress >= 1) self.location = 'index.html';
}
setInterval(loop, 0);