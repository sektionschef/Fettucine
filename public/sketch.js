// console.log("fxhash: " + fxhash);
const NOISESEED = hashFnv32a(fxhash);
// console.log("Noise seed: " + NOISESEED);

let startTime, endTime;
let canvas;
let rescaling_width;
let rescaling_height;
let backgroundTexture;

let ANIMATIONSTATE = true;
let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;  // side which is the limiting factor

let FRAMEDWIDTH = 800;
let FRAMED = false;

let TITLE = "Fettucine";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on html canvas";
let URL = "https://digitalitility.com";
let YEAR = "2023";
let PRICE = "ꜩ 1";
let EDITIONS = "100 editions";

let CURRENTPIXELDENS = 1;


const PALETTESYSTEM = {
  "Brutus": {
    "background": ["#dac289", "#bea977"],
    "pixelColors": ["#8ad1f7", "#0777c2ff", "#034370ff"],
  },
}

choosePalette();


function preload() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // console.log("CURRENTPIXELDENS: " + CURRENTPIXELDENS);

  // if (urlParams.has('infinity')) {
  //   INFINITYSTRING = urlParams.get('infinity');
  //   INFINITY = (INFINITYSTRING === 'true');
  // }
  // console.log("INFINITY: " + INFINITY);

  if (urlParams.has('framed')) {
    if (urlParams.get("framed") === "true") {
      FRAMED = true;
    }
  }

  if (urlParams.has('animated')) {
    if (urlParams.get("animated") === "false") {
      ANIMATIONSTATE = false;
    }
  }

  if (FRAMED) {
    setFrameHTML();
    // setLabelHTML();
  } else {
    setPlainHTML();
  }
  setTagsHTML();


}

function setup() {
  // startTime = performance.now()

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  rescaling_width = 4000;
  rescaling_height = 4000;
  DOMINANTSIDE = 4000;

  canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    canvas.parent("canvasHolderFrame");
  } else {
    canvas.parent("canvasHolderPlain");
  }


  // hatch example
  // A1 = createVector(0.2 * DOMINANTSIDE, width / 2, 0);
  // A2 = createVector(0.6 * DOMINANTSIDE, width / 2, 0);
  // B1 = createVector(0.2 * DOMINANTSIDE, height / 2 - 100, 0);
  // B2 = createVector(0.6 * DOMINANTSIDE, width / 2 + 100, 0);

  // mastahatch = new Hatch(A1, A2, color("#363636"), "", hatchSystem.buffer);
  // hatchSystem.add(mastahatch);
  // mastahatch2 = new Hatch(B1, B2, color("#181818"), "", hatchSystem.buffer);
  // hatchSystem.add(mastahatch2);

  // hatchSystem = new hatchSystem(0, 0, width, height, DOMINANTSIDE * 0.015, color(PALETTE.background[1]));

  v = new Vehicle(createVector(width / 2, height / 2), createVector(width / 4 * 3, height / 8 * 6));

  // brush = new Brush();
  // b = new Brushstroke(brush.buffer);

}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
    background(color(PALETTE.background[0]));
  }

  // show brush
  // image(brush.buffer, 0, 0);

  v.show();
  v.applyForce(v.seek());

  // b.show();
  // b.applyForce(b.seek());



  // fxpreview();

  // let endTime = performance.now()
  // console.log(`It took ${(endTime - startTime) / 1000} seconds.`)
  // noLoop();
}

function mousePressed() {
}
