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
  // "Judd": {
  //   "background": ["#d6d5d5", "#d80f0fff"],
  //   "pixelColors": ["#dadada3b", "#afafafff"],
  // },
  // "Only white": {
  //   "background": ["#d6d5d5", "#f7f7f7ff"],
  //   "pixelColors": ["#9c9c9c3b", "#afafafff"],
  // },
  "Only red": {
    "background": ["#d6d5d5", "#ee4949ff"],
    "pixelColors": ["#d3d3d33b", "#afafafff"],
  }
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

  paper = new Paper();
  noise = new Noise();

  // elements
  // brush = new Brush({
  //   size: 50,
  //   strokeSize: 5,
  //   fillColor: color("#1f1f1f"),
  //   strokeColor: color("#808080")
  // });

  // areaA = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 9),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 9 * 8), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 9), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 9 * 8), // right, end of brushstrokes
  // overlay: true,
  //   densityFactor: 10,
  //   maxSpeedMin: 8,
  //   maxSpeedMax: 20,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 400,
  //   finishedRadius: 20,
  //   targetBdistList: [100, 200],
  //   targetBDirectionList: [-1, 1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1.1,
  //   brushTemplateCount: 15,
  //   brushTemplateSize: 50,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color(PALETTE.pixelColors[0]),
  //   brushTemplateFillColorDistort: 30,
  //   brushTemplateStrokeColor: color(PALETTE.pixelColors[1]),
  //   brushTemplateStrokeColorDistort: 30,
  // });

  areaB = new BrushstrokeSystem({
    originA: createVector(width / 3, height / 9),  // left, start of brushstrokes
    targetA: createVector(width / 3, height / 9 * 8), // left, end of brusshtrokes
    originB: createVector(width / 3 * 2, height / 9), // right, start of brushstrokes
    targetB: createVector(width / 3 * 2, height / 9 * 8), // right, end of brushstrokes
    OVERLAY: false,
    densityFactor: 1,
    maxSpeedMin: 3,
    maxSpeedMax: 10,
    minSpeed: 2,
    maxForce: 2,
    slowRadius: 100,
    finishedRadius: 20,
    targetBdistList: [500, 600],
    targetBDirectionList: [1, -1],
    basicSizeMin: 1,
    basicSizeMax: 3,
    brushTemplateCount: 20,
    brushTemplateSize: 10,
    brushTemplateStrokeSize: 1,
    brushTemplateFillColor: color("#e2e2e2"),
    brushTemplateFillColorDistort: 20,
    brushTemplateStrokeColor: color("#f0f0f0"),
    brushTemplateStrokeColorDistort: 20,
  });

  // originA = createVector(width / 4, height / 9);
  // targetA = createVector(width / 4, height / 9 * 8);
  // b = new Brushstroke(originA, targetA, brush.buffer, brushLy);

  overlay = new Overlay();
}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
  }
  // background(color(PALETTE.background[0]));
  background(color("#fdfdfd"));  // areaB

  // b.updateBrushstroke();
  // b.showBrushstroke();
  // b.applyForce(b.seek(moving_target = true));

  // TEST with rects
  // for (var i = 0; i < 1000; i++) {
  //   push();
  //   fill(distortColorSuperNew(color("#6b6b6b"), 70));
  //   translate(width / 2 + getRandomFromInterval(-500, 500), height / 2 + getRandomFromInterval(-1000, 1000));
  //   rectMode(CENTER);
  //   rect(0, 0, 300, 300);
  //   pop();
  // }

  // areaA.show();
  areaB.show();

  image(overlay.buffer, 0, 0);

  // let endTime = performance.now()
  // console.log(`It took ${(endTime - startTime) / 1000} seconds.`)
  // noLoop();


  paper.show();
  noise.show();

  // areaA.showBrushTemplates();
  areaB.showBrushTemplates();

  // fxpreview();
  noLoop();
}

function mousePressed() {
}
