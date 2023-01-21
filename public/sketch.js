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

let xoff = 0 // delete;

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
    // setFrameHTML();
    // setLabelHTML();
    setSpartaHTML();
  } else {
    setPlainHTML();
  }
  setTagsHTML();


}

function setup() {
  // startTime = performance.now()
  BACKGROUND = "#ee4949ff";
  // BACKGROUND = "#f8cc3bff";
  // BACKGROUND = "#353eb8ff"// "#252746ff";

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  rescaling_width = 4000;
  rescaling_height = 5000;
  DOMINANTSIDE = 4000;

  canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    // canvas.parent("canvasHolderFrame");
    canvas.parent("centerDiv");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  // grid = new Grid();

  // paper = new Paper();
  // backgroundNoise = new Noise();
  // backgroundNoise2 = new Noise();
  // edgePixel = new PixelGradient();

  // overlay = new Overlay(color("#505050"));  // fold color
  // overlay = new Overlay(color(BACKGROUND));  // full overlay color

  // areaA = new BrushstrokeSystem({
  //   originA: createVector(width / 10 * 1, height / 10),  // left, start of brushstrokes
  //   targetA: createVector(width / 10 * 1, height / 10 * 9), // left, end of brusshtrokes
  //   originB: createVector(width / 10 * 9, height / 10), // right, start of brushstrokes
  //   targetB: createVector(width / 10 * 9, height / 10 * 9), // right, end of brushstrokes
  //   OVERLAY: true,
  //   brushCount: 300,  // 100
  //   noiseIncrement: 0.9,  // 0.06 - 0.6
  //   DEBUG: false,
  //   maxSpeedMin: 5,  // 15
  //   maxSpeedMax: 10, // 20
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 40,
  //   finishedRadius: 10,
  //   // targetBdistList: [50, 100, 200],
  //   targetBdistList: [500],
  //   // targetBDirectionList: [-1, 1],
  //   targetBDirectionList: [-1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1.1,
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 50,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#b8b8b883"),
  //   // brushTemplateFillColor: color("#cc1a1a83"),
  //   brushTemplateFillColorDistort: 10,
  //   brushTemplateStrokeColor: color("#6d6d6d83"),
  //   // brushTemplateStrokeColor: color("#52000083"),
  //   brushTemplateStrokeColorDistort: 40,
  //   brushCurveSexyness: 1,
  // });

  layaData = {
    originA: createVector(width / 10 * 1, height / 10),  // left, start of brushstrokes
    targetA: createVector(width / 10 * 1, height / 10 * 9), // left, end of brusshtrokes
    originB: createVector(width / 10 * 9, height / 10), // right, start of brushstrokes
    targetB: createVector(width / 10 * 9, height / 10 * 9), // right, end of brushstrokes
    OVERLAY: false,
    brushCount: 300,  // 100
    noiseIncrement: 0.06,  // 0.06 - 0.6
    DEBUG: false,
    maxSpeedMin: 10,  // 15
    maxSpeedMax: 30, // 20
    minSpeed: 2,
    maxForce: 2,
    slowRadius: 320,
    finishedRadius: 40,
    // targetBdistList: [1000],
    targetBdistList: [200, 500, 750, 1000],
    // targetBDirectionList: [-1],
    targetBDirectionList: [-1, 1],
    basicSizeMin: 1,
    basicSizeMax: 1.5,
    brushTemplateCount: 20,
    brushTemplateSize: 100,
    brushTemplateStrokeSize: 1,  // out
    brushTemplateFillColor: color("#c9c9c9ff"),
    // brushTemplateFillColor: color("#cc1a1a83"),
    brushTemplateFillColorDistort: 20,
    brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    // brushTemplateStrokeColor: color("#52000083"),
    brushTemplateStrokeColorDistort: 20,  // out
    brushCurveSexyness: 1,
  };

  laya = new BrushstrokeSystem(layaData);


  // areaB = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 9),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 9 * 8), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 9), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 9 * 8), // right, end of brushstrokes
  //   OVERLAY: false,
  // brushCount: 100,
  // noiseIncrement: 0.6,  // 0.06
  // DEBUG: false,
  //   densityFactor: 2,
  //   maxSpeedMin: 3,
  //   maxSpeedMax: 10,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 100,
  //   finishedRadius: 20,
  //   targetBdistList: [100, 200, 400, 600, 800],
  //   targetBDirectionList: [1, -1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1,
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 10,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#e2e2e2"),
  //   brushTemplateFillColorDistort: 20,
  //   brushTemplateStrokeColor: color("#f0f0f0"),
  //   brushTemplateStrokeColorDistort: 20,
  // brushCurveSexyness: 1,
  // });



  // example = new BrushstrokeSystem({
  //   originA: createVector(width / 8 * 3, height / 9),  // left, start of brushstrokes
  //   targetA: createVector(width / 8 * 3, height / 9 * 8), // left, end of brusshtrokes
  //   originB: createVector(width / 8 * 5, height / 9), // right, start of brushstrokes
  //   targetB: createVector(width / 8 * 5, height / 9 * 8), // right, end of brushstrokes
  //   OVERLAY: false,
  //   brushCount: 100,
  //   noiseIncrement: 0.6,  // 0.06
  //   DEBUG: false,
  //   maxSpeedMin: 15,
  //   maxSpeedMax: 20,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 40,
  //   finishedRadius: 10,
  //   targetBdistList: [500],
  //   targetBDirectionList: [1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1.1,
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 50,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#b8b8b883"),
  //   brushTemplateFillColorDistort: 10,
  //   brushTemplateStrokeColor: color("#6d6d6d83"),
  //   brushTemplateStrokeColorDistort: 40,
  // brushCurveSexyness: 1,
  // });


}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
  }
  // background(color(PALETTE.background[0]));
  // background(color("#fdfdfd"));  // areaB
  // background(color("#929292"));  // areaC

  // background(color(BACKGROUND));
  background(color("#808080"));
  // background(color("black"));
  // background(color("#e92929"));
  // background(color("#1e1c7e"));
  // background(color("#c9a02fff"));

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
  // areaB.show();

  laya.show();

  // grid.show();

  // layb.show();
  // grid2.show();

  // layc.show();
  // grid3.show();

  // overlay.show();

  // example.create();
  // example.show();

  // areaAb.show();

  // paper.show();
  // backgroundNoise.show();
  // backgroundNoise2.show();
  // edgePixel.show();


  // push();
  // xoff = xoff + 0.01;
  // let n = noise(xoff) * width;
  // stroke("blue");
  // strokeWeight(150);
  // point(n, height / 2);
  // pop();

  // areaA.showBrushTemplates();
  // areaB.showBrushTemplates();

  // laya.showBrushTemplates();


  // fxpreview();
  noLoop();
}

function mousePressed() {
}
