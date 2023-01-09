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
  // BACKGROUND = "#ee4949ff";
  // BACKGROUND = "#f8cc3bff";
  BACKGROUND = "#4b55e0ff"// "#313eecff";

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

  paper = new Paper();
  noise = new Noise();

  areaA = new BrushstrokeSystem({
    originA: createVector(width / 8 * 3, height / 9),  // left, start of brushstrokes
    targetA: createVector(width / 8 * 3, height / 9 * 8), // left, end of brusshtrokes
    originB: createVector(width / 8 * 5, height / 9), // right, start of brushstrokes
    targetB: createVector(width / 8 * 5, height / 9 * 8), // right, end of brushstrokes
    OVERLAY: true,
    densityFactor: 10,
    maxSpeedMin: 15,
    maxSpeedMax: 20,
    minSpeed: 2,
    maxForce: 2,
    slowRadius: 40,
    finishedRadius: 10,
    targetBdistList: [50, 100],
    targetBDirectionList: [-1, 1],
    basicSizeMin: 1,
    basicSizeMax: 1.1,
    brushTemplateCount: 20,
    brushTemplateSize: 50,
    brushTemplateStrokeSize: 1,
    brushTemplateFillColor: color("#b8b8b883"),
    brushTemplateFillColorDistort: 10,
    brushTemplateStrokeColor: color("#6d6d6d83"),
    brushTemplateStrokeColorDistort: 40,
  });


  // areaB = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 9),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 9 * 8), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 9), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 9 * 8), // right, end of brushstrokes
  //   OVERLAY: false,
  //   densityFactor: 1,
  //   maxSpeedMin: 3,
  //   maxSpeedMax: 10,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 100,
  //   finishedRadius: 20,
  //   targetBdistList: [500, 600],
  //   targetBDirectionList: [1, -1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 3,
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 10,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#e2e2e2"),
  //   brushTemplateFillColorDistort: 20,
  //   brushTemplateStrokeColor: color("#f0f0f0"),
  //   brushTemplateStrokeColorDistort: 20,
  // });

  // let borteFillColor = color("#f1f1f1");
  // let borteStrokeColor = color("#cacaca");

  // BorteA = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 9),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 9 * 3), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 9), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 9 * 3), // right, end of brushstrokes
  //   OVERLAY: false,
  //   densityFactor: 15,
  //   maxSpeedMin: 10,
  //   maxSpeedMax: 20,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 100,
  //   finishedRadius: 20,
  //   targetBdistList: [500, 600],
  //   targetBDirectionList: [1, -1],
  //   basicSizeMin: 2,
  //   basicSizeMax: 2,
  //   brushTemplateCount: 10,
  //   brushTemplateSize: 10,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: borteFillColor,
  //   brushTemplateFillColorDistort: 10,
  //   brushTemplateStrokeColor: borteStrokeColor,
  //   brushTemplateStrokeColorDistort: 10,
  // });

  // BorteB = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 9 * 3),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 9 * 6), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 9 * 3), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 9 * 6), // right, end of brushstrokes
  //   OVERLAY: false,
  //   densityFactor: 15,
  //   maxSpeedMin: 3,
  //   maxSpeedMax: 10,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 100,
  //   finishedRadius: 20,
  //   targetBdistList: [500, 600],
  //   targetBDirectionList: [1, -1],
  //   basicSizeMin: 2,
  //   basicSizeMax: 2,
  //   brushTemplateCount: 10,
  //   brushTemplateSize: 10,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: borteFillColor,
  //   brushTemplateFillColorDistort: 10,
  //   brushTemplateStrokeColor: borteStrokeColor,
  //   brushTemplateStrokeColorDistort: 10,
  // });

  // BorteC = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 9 * 6),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 9 * 8), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 9 * 6), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 9 * 8), // right, end of brushstrokes
  //   OVERLAY: false,
  //   densityFactor: 15,
  //   maxSpeedMin: 10,
  //   maxSpeedMax: 20,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 100,
  //   finishedRadius: 20,
  //   targetBdistList: [500, 600],
  //   targetBDirectionList: [1, -1],
  //   basicSizeMin: 2,
  //   basicSizeMax: 2,
  //   brushTemplateCount: 10,
  //   brushTemplateSize: 10,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: borteFillColor,
  //   brushTemplateFillColorDistort: 10,
  //   brushTemplateStrokeColor: borteStrokeColor,
  //   brushTemplateStrokeColorDistort: 10,
  // });

  // overlay = new Overlay(BACKGROUND);

  pixelgradient = new PixelGradient();
}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
  }
  // background(color(PALETTE.background[0]));
  // background(color("#fdfdfd"));  // areaB
  // background(color("#929292"));  // areaC

  background(color(BACKGROUND));  // yellow


  // TEST with rects
  // for (var i = 0; i < 1000; i++) {
  //   push();
  //   fill(distortColorSuperNew(color("#6b6b6b"), 70));
  //   translate(width / 2 + getRandomFromInterval(-500, 500), height / 2 + getRandomFromInterval(-1000, 1000));
  //   rectMode(CENTER);
  //   rect(0, 0, 300, 300);
  //   pop();
  // }

  // areaB.show();
  // areaB.show();

  // BorteA.show();
  // BorteB.show();
  // BorteC.show();


  // image(overlay.buffer, 0, 0);

  areaA.show();

  // paper.show();
  // noise.show();

  pixelgradient.show();

  // areaA.showBrushTemplates();
  // areaB.showBrushTemplates();

  // fxpreview();
  noLoop();
}

function mousePressed() {
}
