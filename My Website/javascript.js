console.log("rainbow.js loaded");

//Variables

let angle = 0;
let brightness = 0;
let running = false;
let timeoutId;
let mcQueenPos_x = -300;
let mcQueenPos_y = 600;
let mcQueenDir = 1;
let mcQueenIntervalId;
let MarkArtemPic_lagIntervalId = null;

//Rainbow BG

function onframe() {
  angle += 50;
  brightness = 65 + Math.random() * 20;
  const color = `hsl(${angle % 360}, 100%, ${brightness}%)`;
  document.body.style.backgroundColor = color;
  timeoutId = setTimeout(onframe, 100);
}

function RAINBOW() {
  const sound = document.getElementById('rainbowsound');

  if (!sound) {
    console.log("rainbowsound element not found");
    return;
  }

  if (running) {
    clearTimeout(timeoutId);
    sound.pause();
    sound.currentTime = 0;
    running = false;
    document.body.style.backgroundColor = 'hsl(195, 100%, 75%)';
    console.log("Rainbow stopped");
  } else {
    sound.volume = 0.3;
    running = true;
    sound.currentTime = 0;
    sound.play().then(() => {
      console.log("Rainbow sound played");
    }).catch((e) => {
      console.log("Sound play failed:", e);
    });
    onframe();
    console.log("Rainbow started");
  }
}

let currentRotation = 0;

//DECA Image

function playSoundAndRotate() {
  const sound = document.getElementById('clickSound');
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch((e) => {
      console.log("Sound failed:", e);
    });
  }

  currentRotation += 720;
  const img = document.getElementById('decaImage');
  img.style.transform = `rotate(${currentRotation}deg)`;
  img.style.transition = 'transform 1.5s';
}

let lastSoundTime = 0;

function playKachowSound() {
  const sound = new Audio('assets/kachow.mp3');
  sound.volume = 0.3;
  sound.play().catch(e => console.log("Sound failed:", e));
}

//McQueen Zooming

function mcQueen() {
  const mcqueen = document.getElementById('mcqueenimage');
  const now = Date.now();

  mcQueenPos_x += 20 * mcQueenDir;
  mcqueen.style.left = mcQueenPos_x + "px";
  mcqueen.style.top = mcQueenPos_y + "px";

  if (mcQueenDir === 1) {
    mcqueen.style.transform = "scaleX(-1)";
  } else {
    mcqueen.style.transform = "scaleX(1)";
  }

  if (mcQueenPos_x >= 1200) {
    mcQueenDir = -1;
    if (now - lastSoundTime > 400) {
      playKachowSound();
      lastSoundTime = now;
    }
  } else if (mcQueenPos_x <= -200) {
    mcQueenDir = 1;
    if (now - lastSoundTime > 1000) {
      playKachowSound();
      lastSoundTime = now;
    }
  }
}

let mcQueenRunning = false;

function startMcQueen() {
  if (!mcQueenRunning) {
    mcQueenIntervalId = setInterval(mcQueen, 2);
    mcQueenRunning = true;
  } else {
    stopMcQueen();
    mcQueenRunning = false;
  }
}

function stopMcQueen() {
  clearInterval(mcQueenIntervalId);
  mcQueenIntervalId = null;
}

//Mark & Artem lag pic

function MarkArtemPic_lag() {
  const img = document.getElementById('MarkArtemImage');
  const maxWidth = window.innerWidth - img.offsetWidth;
  const maxHeight = window.innerHeight - img.offsetHeight;

  const randomLeft = Math.floor(Math.random() * 2001) - 1000
  const randomTop = Math.floor(Math.random() * 100);

  img.style.left = randomLeft + 'px';
  img.style.top = randomTop + 'px';
}

function startMarkArtemLag() {
  if (!MarkArtemPic_lagIntervalId) {
    MarkArtemPic_lagIntervalId = setInterval(MarkArtemPic_lag, 10);
  } else {
    clearInterval(MarkArtemPic_lagIntervalId);
    MarkArtemPic_lagIntervalId = null;
  }
}

function snowing() {
}