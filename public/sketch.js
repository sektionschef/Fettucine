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

  // rescaling_width = 2400; // 4000;
  // rescaling_height = 3000; // 5000;
  // DOMINANTSIDE = 2400; // 4000;

  rescaling_width = 4000;
  rescaling_height = 5000;

  if (rescaling_width <= rescaling_height) {
    DOMINANTSIDE = rescaling_width;
  } else {
    DOMINANTSIDE = rescaling_height;
  }
  TOTALPIXEL = rescaling_width * rescaling_height;

  canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    // canvas.parent("canvasHolderFrame");
    canvas.parent("centerDiv");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  columnRowCount = getRandomFromList([1, 2, 3, 4])

  gridProfiles = [
    // {
    //   stripeOrientation: "x",
    // boxCountDominant: 80,
    //   stripeColumnCount: 2,
    //   stripeRowCount: 2,
    //   sizeStripe: 3,
    //   paddingShortCount: 8 * 1, // 5*2
    //   paddingLongCount: 10 * 1,
    //   thickness: 1,
    // },
    {
      stripeOrientation: "x",
      boxCountDominant: 80,
      stripeColumnCount: 4,
      stripeRowCount: 2,
      sizeStripe: 15, // of boxcount;
      paddingShortCount: 5, // 5*2
      paddingLongCount: 10,
      thickness: 1,
    },
  ]


  // paper = new Paper();
  // backgroundNoise = new Noise();
  // edgePixel = new PixelGradient();


  // gridTexture = createGraphics(width, height);
  // push();
  // gridTexture.image(paper.masterBuffer, 0, 0);
  // gridTexture.image(edgePixel.masterBuffer, 0, 0);
  // pop();

  grid = new Grid(getRandomFromList(gridProfiles));
  // // PAPER REDUCED TO SHAPE OF GRID
  // gridTexture = maskBuffers(gridTexture, grid.buffer);


  // areaA = new BrushstrokeSystem({
  //   originA: createVector(0, 0),  // left, start of brushstrokes
  //   targetA: createVector(0, height), // left, end of brusshtrokes
  //   originB: createVector(width, 0), // right, start of brushstrokes
  //   targetB: createVector(width, height), // right, end of brushstrokes
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
  //   targetBDirectionList: [-1, 1],
  //   // targetBDirectionList: [-1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1.1,
  //   noiseColor: [color("#252525"), color("#fcfcfc"), color("#cacaca")],
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
  //   brushPixelDistort: 50,
  //   brushOpacityDistort: 50,
  // });

  layaData = {
    originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
    targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
    originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
    targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
    OVERLAY: false,
    brushCount: 100, //500,  // 100
    noiseIncrement: 0.06,  // 0.06 - 0.6
    DEBUG: false,
    maxSpeedMin: 10,  // 15
    maxSpeedMax: 30, // 20
    minSpeed: 2,
    maxForce: 2,
    slowRadius: 320,
    finishedRadius: 40,
    // targetBdistList: [1000],
    targetBdistList: [500, 750, 1000, 2000],
    // targetBDirectionList: [-1],
    targetBDirectionList: [-1, 1],
    basicSizeMin: 1,
    basicSizeMax: 1.5,
    noiseColor: [color("#b4b4b4"), color("#fcfcfc"), color("#cacaca")],
    brushTemplateCount: 20,
    brushTemplateSize: 200,
    // brushTemplateStrokeSize: 1,  // out
    brushTemplateFillColor: color("#c9c9c9ff"),
    // brushTemplateFillColor: color("#cc1a1a83"),
    brushTemplateFillColorDistort: 20,
    // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    // brushTemplateStrokeColor: color("#52000083"),
    // brushTemplateStrokeColorDistort: 20,  // out
    brushCurveSexyness: 1,
    brushPixelDistort: 50,
    brushOpacityDistort: 50,
  };

  // laya = new BrushstrokeSystem(layaData);

  laybData = {
    originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
    targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
    originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
    targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
    OVERLAY: false,
    brushCount: 100, //500,  // 100
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
    noiseColor: [color("#888787"), color("#cccccc"), color("#ffffff")],
    brushTemplateCount: 20,
    brushTemplateSize: 100,
    // brushTemplateStrokeSize: 1,  // out
    brushTemplateFillColor: color("#c9c9c9ff"),
    // brushTemplateFillColor: color("#cc1a1a83"),
    brushTemplateFillColorDistort: 20,
    // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    // brushTemplateStrokeColor: color("#52000083"),
    // brushTemplateStrokeColorDistort: 20,  // out
    brushCurveSexyness: 1,
    brushPixelDistort: 50,
    brushOpacityDistort: 50,
  };

  // layb = new BrushstrokeSystem(laybData);

  laycData = {
    // y
    originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
    targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
    originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
    targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
    // x
    // originA: createVector(0, height),  // left, start of brushstrokes
    // targetA: createVector(width, height), // left, end of brusshtrokes
    // originB: createVector(0, 0), // right, start of brushstrokes
    // targetB: createVector(width, 0), // right, end of brushstrokes
    OVERLAY: false,
    brushCount: 300, //500,  // 100
    noiseIncrement: 0.006,  // 0.06 - 0.6
    DEBUG: false,
    maxSpeedMin: 10,  // 15
    maxSpeedMax: 30, // 20
    minSpeed: 2,
    maxForce: 2,
    slowRadius: 320,
    finishedRadius: 40,
    // targetBdistList: [1000],
    targetBdistList: [200, 500, 600, 750, 1000, 2000],
    // targetBDirectionList: [-1],
    targetBDirectionList: [-1, 1],
    basicSizeMin: 1,
    basicSizeMax: 1.5,
    noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    brushTemplateCount: 20,
    brushTemplateSize: 50,
    // brushTemplateStrokeSize: 1,  // out
    brushTemplateFillColor: color("#c9c9c9ff"),
    // brushTemplateFillColor: color("#cc1a1a83"),
    brushTemplateFillColorDistort: 20,
    // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    // brushTemplateStrokeColor: color("#52000083"),
    // brushTemplateStrokeColorDistort: 20,  // out
    brushCurveSexyness: 1,
    brushPixelDistort: 50,
    brushOpacityDistort: 50,
  };

  // layc = new BrushstrokeSystem(laycData);

  // areaB = new BrushstrokeSystem({
  //   originA: createVector(width / 3, height / 10),  // left, start of brushstrokes
  //   targetA: createVector(width / 3, height / 10 * 9), // left, end of brusshtrokes
  //   originB: createVector(width / 3 * 2, height / 10), // right, start of brushstrokes
  //   targetB: createVector(width / 3 * 2, height / 10 * 9), // right, end of brushstrokes
  //   OVERLAY: false,
  //   brushCount: 400,
  //   noiseIncrement: 0.6,  // 0.06
  //   DEBUG: false,
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
  //   // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
  //   noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 60,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#e2e2e2"),
  //   brushTemplateFillColorDistort: 20,
  //   brushTemplateStrokeColor: color("#f0f0f0"),
  //   brushTemplateStrokeColorDistort: 20,
  //   brushCurveSexyness: 1,
  //   brushPixelDistort: 50,
  //   brushOpacityDistort: 50,
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

  // background(color(BACKGROUND));
  background(color("#e7e7e7"));
  // background(color("black"));
  // background(color("#e92929"));
  // background(color("#1e1c7e"));
  // background(color("#c9a02fff"));


  // areaA.show();
  // areaB.show();

  // laya.show();
  // layb.show();
  // layc.show();

  // paper.show();
  // edgePixel.show();

  grid.show();
  // push();
  // blendMode(OVERLAY);
  // image(gridTexture, 0, 0);
  // pop();

  // backgroundNoise.show();


  // areaA.showBrushTemplates();
  // areaB.showBrushTemplates();

  // laya.showBrushTemplates();


  // fxpreview();
  noLoop();
}

function mousePressed() {
}
