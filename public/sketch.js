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

let FRAMEDWIDTH = 800;
let FRAMED = false;  // fixed width
let SENZA = false;  // no stylesheet, close inspection

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
  "Judd": {
    "background": "#d80f0fff",
    "tint": "#fafafa",
  },
  // "Grey Susi": {
  //   "background": "#3a3939ff",
  //   "tint": "#fafafa",
  // },
  // "New Red Baron": {
  //   "background": "#ff0000ff",
  //   "tint": "#fafafa", // "#e7e7e7",
  // },
  // "Yellow Mowy": {
  //   "background": "#ffba39ff",
  //   "tint": "#fafafa", // "#e7e7e7",
  // },
  // "Hasenhüttl": {
  //   "background": "#ffa600ff",
  //   "tint": "#fafafa", // "#e7e7e7",
  // },
  // "Grind": {
  //   "background": "#314ce4ff",
  //   "tint": "#fafafa", // "#e7e7e7",
  // },
  // "Alles gut mein Kind": {
  //   "background": "#273797ff",
  //   "tint": "#fafafa", // "#e7e7e7",
  // },
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

  if (urlParams.has('senza')) {
    if (urlParams.get("senza") === "true") {
      SENZA = true;
    }
  }

  if (urlParams.has('animated')) {
    if (urlParams.get("animated") === "false") {
      ANIMATIONSTATE = false;
    }
  }

  if (SENZA == false) {
    // var w = window.screen.width;
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "styles.css";
    document.head.appendChild(link);
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
  // BACKGROUND = "#ee4949ff";
  // BACKGROUND = "#e0bc46ff";
  // BACKGROUND = "#314ce4ff"// "#273797ff";
  // BACKGROUND = "#e0469bff";

  BACKGROUND = PALETTE.background;

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  canvasFormats = [
    {
      "name": "4:3",
      "canvasWidth": 4000,
      "canvasHeight": 3000,
    },
    {
      "name": "3:4",
      "canvasWidth": 3000,
      "canvasHeight": 4000,
    },
    {
      "name": "16:9",
      "canvasWidth": 3840,
      "canvasHeight": 2160,
    },
    {
      "name": "9:16",
      "canvasWidth": 2160,
      "canvasHeight": 3840,
    },
    {
      "name": "1:1",
      "canvasWidth": 4000,
      "canvasHeight": 4000,
    },
    {
      "name": "3:2",
      "canvasWidth": 3000,
      "canvasHeight": 2000,
    },
    {
      "name": "2:3",
      "canvasWidth": 2000,
      "canvasHeight": 3000,
    }
  ]

  canvasFormatChosen = getRandomFromList(canvasFormats);
  console.log("Canvas Format: " + canvasFormatChosen.name);

  // rescaling_width = 2400; // 4000;
  // rescaling_height = 3000; // 5000;
  // SHORTSIDE = 2400; // 4000;

  // rescaling_width = 4000;
  // rescaling_height = 5000;

  rescaling_width = canvasFormatChosen.canvasWidth;
  rescaling_height = canvasFormatChosen.canvasHeight;

  if (rescaling_width <= rescaling_height) {
    SHORTSIDE = rescaling_width;
    LONGSIDE = rescaling_height;
  } else {
    SHORTSIDE = rescaling_height;
    LONGSIDE = rescaling_width;
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


  gridProfile = {
    stripeOrientation: getRandomFromList(["x", "y"]),
    countColumnOrRow: getRandomFromList([1, 2, 3, 4]),
    bezierFactor: getRandomFromList([0.001, 0.005, 0.007, 0.01]),
    thickness: 1,
    spacing: getRandomFromList([1, 2, 3]),
  }

  paper = new Paper();
  corny = new Corny();
  edgePixel = new PixelGradient();

  backgroundNoise = new Noise();

  // gridTexture = createGraphics(width, height);
  // push();
  // gridTexture.image(paper.masterBuffer, 0, 0);
  // gridTexture.image(edgePixel.masterBuffer, 0, 0);
  // pop();

  // noiseStripesMask = new NoiseStripes(createVector(0, 0), createVector(width, height), "x");

  // grid = new Grid(getRandomFromList(gridProfiles));
  // PAPER REDUCED TO SHAPE OF GRID
  // gridTexture = maskBuffers(gridTexture, grid.buffer);

  // noiseStripes = new NoiseStripes(p5.Vector.sub(grid.totalA, createVector(50, 50)), p5.Vector.add(grid.totalC, createVector(50, 50)), grid.stripeOrientation);
  // noiseStripesMask = new NoiseStripes(createVector(0, 0), createVector(width, height), grid.stripeOrientation);

  // fillNoiseOverlay = new BrushstrokeSystem({
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
  //   brushType: "Fill Noise",
  //   brushCurveSexyness: 1,
  //   brushPixelDistort: 50,
  //   brushOpacityDistort: 50,
  // });

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

  // laya = new BrushstrokeSystem({
  //   originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
  //   targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
  //   originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
  //   targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
  //   OVERLAY: false,
  //   brushCount: 100, //500,  // 100
  //   noiseIncrement: 0.06,  // 0.06 - 0.6
  //   DEBUG: false,
  //   maxSpeedMin: 10,  // 15
  //   maxSpeedMax: 30, // 20
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 320,
  //   finishedRadius: 40,
  //   // targetBdistList: [1000],
  //   targetBdistList: [500, 750, 1000, 2000],
  //   // targetBDirectionList: [-1],
  //   targetBDirectionList: [-1, 1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1.5,
  //   noiseColor: [color("#b4b4b4"), color("#fcfcfc"), color("#cacaca")],
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 200,
  //   // brushTemplateStrokeSize: 1,  // out
  //   brushTemplateFillColor: color("#c9c9c9ff"),
  //   // brushTemplateFillColor: color("#cc1a1a83"),
  //   brushTemplateFillColorDistort: 20,
  //   // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
  //   brushTemplateStrokeColor: color("#52000083"),
  //   // brushTemplateStrokeColorDistort: 20,  // out
  //   brushType: "Fill Noise",
  //   brushCurveSexyness: 1,
  //   brushPixelDistort: 50,
  //   brushOpacityDistort: 50,
  // });


  // layb = new BrushstrokeSystem({
  //   originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
  //   targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
  //   originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
  //   targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
  //   OVERLAY: false,
  //   brushCount: 100, //500,  // 100
  //   noiseIncrement: 0.06,  // 0.06 - 0.6
  //   DEBUG: false,
  //   maxSpeedMin: 10,  // 15
  //   maxSpeedMax: 30, // 20
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 320,
  //   finishedRadius: 40,
  //   // targetBdistList: [1000],
  //   targetBdistList: [200, 500, 750, 1000],
  //   // targetBDirectionList: [-1],
  //   targetBDirectionList: [-1, 1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1.5,
  //   noiseColor: [color("#888787"), color("#cccccc"), color("#ffffff")],
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 100,
  //   // brushTemplateStrokeSize: 1,  // out
  //   brushTemplateFillColor: color("#c9c9c9ff"),
  //   // brushTemplateFillColor: color("#cc1a1a83"),
  //   brushTemplateFillColorDistort: 20,
  //   // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
  //   brushTemplateStrokeColor: color("#52000083"),
  //   // brushTemplateStrokeColorDistort: 20,  // out
  //   brushType: "Fill Noise",
  //   brushCurveSexyness: 1,
  //   brushPixelDistort: 50,
  //   brushOpacityDistort: 50,
  // });

  layc = new BrushstrokeSystem({
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
    // noiseColor: [color("#fd7b2f"), color("#ffa96f"), color("#f7dcc2")],
    brushTemplateCount: 20,
    brushTemplateSize: 50,
    // brushTemplateStrokeSize: 1,  // out
    brushTemplateFillColor: color("#c9c9c9ff"),
    // brushTemplateFillColor: color("#cc1a1a83"),
    brushTemplateFillColorDistort: 20,
    // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    brushTemplateStrokeColor: color("#52000083"),
    // brushTemplateStrokeColorDistort: 20,  // out
    brushType: "Fill Noise",
    brushCurveSexyness: 1,
    brushPixelDistort: 50,
    brushOpacityDistort: 50,
  });


  // fillNoisePart = new BrushstrokeSystem({
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
  //   noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 60,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#e2e2e2"),
  //   brushTemplateFillColorDistort: 20,
  //   brushTemplateStrokeColor: color("#f0f0f0"),
  //   brushTemplateStrokeColorDistort: 20,
  //   brushType: "Fill Noise",
  //   brushCurveSexyness: 1,
  //   brushPixelDistort: 50,
  //   brushOpacityDistort: 50,
  // });


  // strokeNoise = new BrushstrokeSystem({
  //   originA: createVector(0, 0),  // left, start of brushstrokes
  //   targetA: createVector(0, height), // left, end of brusshtrokes
  //   originB: createVector(width, 0), // right, start of brushstrokes
  //   targetB: createVector(width, height), // right, end of brushstrokes
  //   OVERLAY: false,
  //   brushCount: 300,
  //   noiseIncrement: 0.01,  // 0.009
  //   DEBUG: false,
  //   densityFactor: 2,
  //   maxSpeedMin: 10,
  //   maxSpeedMax: 50,
  //   minSpeed: 2,
  //   maxForce: 2,
  //   slowRadius: 100,
  //   finishedRadius: 20,
  //   targetBdistList: [600],
  //   targetBDirectionList: [1],
  //   basicSizeMin: 1,
  //   basicSizeMax: 1,
  //   noiseColor: [color("#ebebeb")],
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 100,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#e2e2e2"),
  //   brushTemplateFillColorDistort: 20,
  //   brushTemplateStrokeColor: color("#929292"),
  //   brushTemplateStrokeColorDistort: 50,
  //   brushType: "Stroke Noise",
  //   brushCurveSexyness: 1,
  //   brushPixelDistort: 150,
  //   brushOpacityDistort: 0,
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
  //   noiseColor: [color("#727272")],
  //   brushTemplateCount: 20,
  //   brushTemplateSize: 50,
  //   brushTemplateStrokeSize: 1,
  //   brushTemplateFillColor: color("#b8b8b883"),
  //   brushTemplateFillColorDistort: 10,
  //   brushTemplateStrokeColor: color("#6d6d6d83"),
  //   brushTemplateStrokeColorDistort: 40,
  //   brushCurveSexyness: 1,
  // });

  grid = new Grid(gridProfile);

  window.$fxhashFeatures = {
    "Format": canvasFormatChosen,
    // "Palette": PALETTE_LABEL,
    // "Element Count": TRIANGLECOUNT_LABEL,
    // "Element types": PICKER_LABEL,
  }

  console.info(`fxhash: %c${fxhash}`, 'font-weight: bold');
  console.info(`Format: %c${canvasFormatChosen.name}`, 'font-weight: bold');
  console.info(`Stripe Orientation: %c${gridProfile.stripeOrientation}`, 'font-weight: bold');
  console.info(`Number of rows or columns: %c${gridProfile.countColumnOrRow}`, 'font-weight: bold');
  console.info(`Wobbly factor: %c${gridProfile.bezierFactor}`, 'font-weight: bold');
  console.info(`Stripe thickness: %c${gridProfile.thickness}`, 'font-weight: bold');
  console.info(`Stripe spacing: %c${gridProfile.spacing}`, 'font-weight: bold');
  console.log('');
  // console.group(`Palette: %c${PALETTE_LABEL} `, 'font-weight: bold');
  // console.log(`background: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['background']}; `);
  // console.log(`primaries: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['primaries'][0]}; `);
  // console.log(`primaries: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['primaries'][1]}; `);
  // console.log(`hatches: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['hatches'][0]}; `);
  // console.log(`hatches: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['hatches'][1]}; `);
  // console.log(`rothkoStroke: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['rothkoStroke']}; `);
  // console.log(`dirtline: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['dirtline']}; `);
  // console.log(`dirtCircles: %c   `, `background: ${PALETTESYSTEM[PALETTE_LABEL]['dirtCircles']}; `);
  // console.groupEnd();
  // console.log(`Palette: %c${PALETTE_LABEL} `, 'font-weight: bold');
  // console.log(`Color smudge: %c${ROUGHYPUFFYLABEL}`, 'font-weight: bold');
  // console.log(`Brush direction: %c${BRUSHDIRECTIONLABEL}`, 'font-weight: bold');
  // console.log('');
}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
  }

  // background(color(BACKGROUND));
  // background(color("#d8d8d8"));
  // background(color("black"));
  // background(color("#e92929"));
  // background(color("#1e1c7e"));
  // background(color("#c9a02fff"));
  background(PALETTE.tint);


  // fillNoiseOverlay.show();
  // fillNoisePart.show();
  // strokeNoise.show();

  // example.show();

  // areaA.show();
  // areaB.show();

  // PAPER
  // laya.show();
  // layb.show();
  // layc.show();
  // noiseStripes.show();

  // PAPER
  corny.show();
  paper.show();
  edgePixel.show();

  // backgroundNoise.show();


  // GRID ON TOP
  grid.show();

  // push();
  // blendMode(OVERLAY);
  // image(gridTexture, 0, 0);
  // pop();
  // backgroundNoise.show();

  // PROTOTYPE WITH RED COLOR
  // grid.show();
  // push();
  // // blendMode(OVERLAY);
  // // image(noiseStripesMask.masterBuffer, 0, 0);
  // tint(255, 150);
  // image(maskBuffers(noiseStripesMask.masterBuffer, grid.buffer), 0, 0);
  // pop();
  // grid.show();


  // COOL MIT LAYC
  // push();
  // blendMode(OVERLAY);
  // // image(maskBuffers(layc.buffer, grid.buffer), 0, 0);
  // image(maskBuffers(layb.buffer, grid.buffer), 0, 0);
  // pop();
  // grid.show();

  // TEST MIT NOISE AUF DIE EINZELNEN BLÄTTER
  // grid.show();

  // paper.show();
  // backgroundNoise.show();

  // notes - nicht zu pixelig, noise is gut, aber paper zu viel. vlt nur hintergrund.


  // noiseStripesMask.show();

  // areaA.showBrushTemplates();
  // areaB.showBrushTemplates();
  // areaC.showBrushTemplates();

  // laya.showBrushTemplates();


  // PROTOTYPE SPLATTER
  // push();
  // let blob = createGraphics(width, height);
  // let changer = 100;
  // let loopCount = 40;
  // for (var i = 0; i < loopCount; i++) {
  //   blob.fill(color(50, 20));
  //   blob.noStroke();
  //   blob.beginShape();
  //   blob.vertex(1000, 1000);
  //   blob.bezierVertex(1200 + getRandomFromInterval(-changer, changer), 1000 + getRandomFromInterval(-changer, changer), 1300 + getRandomFromInterval(-changer, changer), 1100 + getRandomFromInterval(-changer, changer), 1500, 1500);
  //   blob.endShape(CLOSE);
  // }
  // blendMode(OVERLAY);
  // image(blob, 0, 0);
  // pop();

  // fxpreview();
  noLoop();
}

function mousePressed() {
}
