const NOISESEED = hashFnv32a(fxhash);

let BULK = false;
let startTime, endTime;
let canvas;
let rescaling_width;
let rescaling_height;
let backgroundTexture;

let ANIMATIONSTATE = true;
let ALLDONE = false;

let TITLE = "Materialista";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on html canvas";
let URL = "https://digitalitility.com";
let YEAR = "2023";
let PRICE = "ꜩ 4";
let EDITIONS = "256 editions";

let CURRENTPIXELDENS = 1;


function preload() {
}

function setup() {
  // startTime = performance.now()

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
  // console.log("Canvas Format: " + canvasFormatChosen.name);

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

  if (document.getElementById('centerDiv')) {
    canvas.parent("centerDiv");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  oida = false;
  // Gradient, Noise schwierig, bei Stroke noise auswahl fill oder strok - dark oder light
  let type = getRandomFromList(["Stroke Noise", "Gradient", "Noise", "Fill Noise", "Only Perlin", "Combined Perlin"]);
  let county = Math.round(getRandomFromInterval(50, 500)); // 500, 300;
  let manouvre = getRandomFromList([[50, 100, 300], [100, 300, 500], [500, 750, 1000, 2000]]);  // UPDOWN [50], [100], [500, 750, 1000, 2000]
  let directions = getRandomFromList([[-1, 1], [1], [-1]]);
  let noiseIncrement = getRandomFromList([0.01, 0.06, 0.6]);
  let whichLoopLevel = "last"; // getRandomFromList(["last", "secondlast", "thirdlast"])
  let overlay = getRandomFromList([true, false]);
  let maxSpeedMin = Math.round(getRandomFromInterval(5, 15));
  let maxSpeedMax = Math.round(maxSpeedMin + getRandomFromInterval(5, 10));

  console.log("whichLoopLevel: " + whichLoopLevel);
  console.log("type: " + type);
  console.log("county: " + county);
  console.log("manouvre: " + manouvre);
  console.log("directions: " + directions);
  console.log("noiseIncrement: " + noiseIncrement);
  console.log("overlay: " + overlay);
  console.log("maxSpeedMin: " + maxSpeedMin);
  console.log("maxSpeedMax: " + maxSpeedMax);


  // size, and count and looplayer count and type
  patternProfilesUN = [
    [{
      name: "flicknX",
      orientation: "x",
      OVERLAY: overlay,
      brushCount: county,
      noiseIncrement: noiseIncrement,
      DEBUG: false,
      maxSpeedMin: maxSpeedMin,
      maxSpeedMax: maxSpeedMax,
      minSpeed: 2,
      maxForce: 2,
      slowRadius: 320,
      finishedRadius: 40,
      targetBdistList: manouvre,
      targetBDirectionList: directions,
      basicSizeMin: 1,
      basicSizeMax: 1.5,
      noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
      brushTemplateCount: 20,
      brushTemplateSize: 200,
      brushTemplateStrokeSize: 1,
      brushTemplateFillColor: color(PALETTE.lightColor),
      brushTemplateFillColorDistort: 20,
      brushTemplateStrokeColor: color(PALETTE.darkColor),
      brushTemplateStrokeColorDistort: 20,
      brushType: type,
      brushCurveSexyness: 1,
      brushPixelDistort: 50,
    },
    {
      name: "flicknY",
      orientation: "y",
      OVERLAY: overlay,
      brushCount: county,
      noiseIncrement: noiseIncrement,
      DEBUG: false,
      maxSpeedMin: maxSpeedMin,
      maxSpeedMax: maxSpeedMax,
      minSpeed: 2,
      maxForce: 2,
      slowRadius: 320,
      finishedRadius: 40,
      targetBdistList: manouvre,
      targetBDirectionList: directions,
      basicSizeMin: 1,
      basicSizeMax: 1.5,
      noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
      brushTemplateCount: 20,
      brushTemplateSize: 200,
      brushTemplateStrokeSize: 1,
      brushTemplateFillColor: color(PALETTE.lightColor),
      brushTemplateFillColorDistort: 20,
      brushTemplateStrokeColor: color(PALETTE.darkColor),
      brushTemplateStrokeColorDistort: 20,
      brushType: type,
      brushCurveSexyness: 1,
      brushPixelDistort: 50,
    },
    ]
  ]

  patternProfiles = [
    [{
      name: "laya",
      // originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
      // targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
      // originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
      // targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
      orientation: getRandomFromList(["x"]),
      OVERLAY: false,
      brushCount: 100, //500,  // 100 - UPDOWN
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
      // noiseColor: [color("#b4b4b4"), color("#fcfcfc"), color("#cacaca")],
      // noiseColor: [color("#9b9b9b"), color("#7c7c7c"), color("#5a5a5a")],
      noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
      brushTemplateCount: 20,
      brushTemplateSize: 200,
      brushTemplateStrokeSize: 1,  // out
      brushTemplateFillColor: color("#c9c9c9ff"),
      // brushTemplateFillColor: color("#cc1a1a83"),
      brushTemplateFillColorDistort: 20,
      // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
      brushTemplateStrokeColor: color("#52000083"),
      // brushTemplateStrokeColorDistort: 20,  // out
      brushType: "Fill Noise",
      brushCurveSexyness: 1,
      brushPixelDistort: 50,
    },
    {
      name: "laya",
      // originA: createVector(width / 10 * 0, height / 10 * 0),  // left, start of brushstrokes
      // targetA: createVector(width / 10 * 0, height / 10 * 10), // left, end of brusshtrokes
      // originB: createVector(width / 10 * 10, height / 10 * 0), // right, start of brushstrokes
      // targetB: createVector(width / 10 * 10, height / 10 * 10), // right, end of brushstrokes
      orientation: getRandomFromList(["y"]),
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
      // noiseColor: [color("#b4b4b4"), color("#fcfcfc"), color("#cacaca")],
      // noiseColor: [color("#9b9b9b"), color("#7c7c7c"), color("#5a5a5a")],
      noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
      brushTemplateCount: 20,
      brushTemplateSize: 200,
      brushTemplateStrokeSize: 1,  // out
      brushTemplateFillColor: color("#c9c9c9ff"),
      // brushTemplateFillColor: color("#cc1a1a83"),
      brushTemplateFillColorDistort: 20,
      // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
      brushTemplateStrokeColor: color("#52000083"),
      // brushTemplateStrokeColorDistort: 20,  // out
      brushType: "Fill Noise",
      brushCurveSexyness: 1,
      brushPixelDistort: 50,
    },
    ],
    // [{
    //   name: "layb",
    //   orientation: getRandomFromList(["x"]),
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
    //   // noiseColor: [color("#888787"), color("#cccccc"), color("#ffffff")],
    //   // noiseColor: [color("#9b9b9b"), color("#7c7c7c"), color("#5a5a5a")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //   brushTemplateCount: 20,
    //   brushTemplateSize: 100,
    //   brushTemplateStrokeSize: 1,  // out
    //   brushTemplateFillColor: color("#c9c9c9ff"),
    //   // brushTemplateFillColor: color("#cc1a1a83"),
    //   brushTemplateFillColorDistort: 20,
    //   // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    //   brushTemplateStrokeColor: color("#52000083"),
    //   // brushTemplateStrokeColorDistort: 20,  // out
    //   brushType: "Fill Noise",
    //   brushCurveSexyness: 1,
    //   brushPixelDistort: 50,
    // },
    // {
    //   name: "layb",
    //   orientation: getRandomFromList(["y"]),
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
    //   // noiseColor: [color("#888787"), color("#cccccc"), color("#ffffff")],
    //   // noiseColor: [color("#9b9b9b"), color("#7c7c7c"), color("#5a5a5a")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //   brushTemplateCount: 20,
    //   brushTemplateSize: 100,
    //   brushTemplateStrokeSize: 1,  // out
    //   brushTemplateFillColor: color("#c9c9c9ff"),
    //   // brushTemplateFillColor: color("#cc1a1a83"),
    //   brushTemplateFillColorDistort: 20,
    //   // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    //   brushTemplateStrokeColor: color("#52000083"),
    //   // brushTemplateStrokeColorDistort: 20,  // out
    //   brushType: "Fill Noise",
    //   brushCurveSexyness: 1,
    //   brushPixelDistort: 50,
    // },
    // ],
    // [{
    //   name: "ehemals layc",
    //   orientation: getRandomFromList(["x"]),
    //   OVERLAY: false,
    //   brushCount: 300, //500,  // 100
    //   noiseIncrement: 0.006,  // 0.06 - 0.6
    //   DEBUG: false,
    //   maxSpeedMin: 10,  // 15
    //   maxSpeedMax: 30, // 20
    //   minSpeed: 2,
    //   maxForce: 2,
    //   slowRadius: 320,
    //   finishedRadius: 40,
    //   // targetBdistList: [1000],
    //   targetBdistList: [200, 500, 600, 750, 1000, 2000],
    //   // targetBDirectionList: [-1],
    //   targetBDirectionList: [-1, 1],
    //   basicSizeMin: 1,
    //   basicSizeMax: 1.5,
    //   // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //   // noiseColor: [color("#fd7b2f"), color("#ffa96f"), color("#f7dcc2")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //   brushTemplateCount: 20,
    //   brushTemplateSize: 50,
    //   brushTemplateStrokeSize: 1,  // out
    //   brushTemplateFillColor: color("#c9c9c9ff"),
    //   // brushTemplateFillColor: color("#cc1a1a83"),
    //   brushTemplateFillColorDistort: 20,
    //   // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    //   brushTemplateStrokeColor: color("#52000083"),
    //   // brushTemplateStrokeColorDistort: 20,  // out
    //   brushType: "Fill Noise",
    //   brushCurveSexyness: 1,
    //   brushPixelDistort: 50,
    // },
    // {
    //   name: "ehemals layc",
    //   orientation: getRandomFromList(["y"]),
    //   OVERLAY: false,
    //   brushCount: 300, //500,  // 100
    //   noiseIncrement: 0.006,  // 0.06 - 0.6
    //   DEBUG: false,
    //   maxSpeedMin: 10,  // 15
    //   maxSpeedMax: 30, // 20
    //   minSpeed: 2,
    //   maxForce: 2,
    //   slowRadius: 320,
    //   finishedRadius: 40,
    //   // targetBdistList: [1000],
    //   targetBdistList: [200, 500, 600, 750, 1000, 2000],
    //   // targetBDirectionList: [-1],
    //   targetBDirectionList: [-1, 1],
    //   basicSizeMin: 1,
    //   basicSizeMax: 1.5,
    //   // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //   // noiseColor: [color("#fd7b2f"), color("#ffa96f"), color("#f7dcc2")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //   brushTemplateCount: 20,
    //   brushTemplateSize: 50,
    //   brushTemplateStrokeSize: 1,  // out
    //   brushTemplateFillColor: color("#c9c9c9ff"),
    //   // brushTemplateFillColor: color("#cc1a1a83"),
    //   brushTemplateFillColorDistort: 20,
    //   // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    //   brushTemplateStrokeColor: color("#52000083"),
    //   // brushTemplateStrokeColorDistort: 20,  // out
    //   brushType: "Fill Noise",
    //   brushCurveSexyness: 1,
    //   brushPixelDistort: 50,
    // }
    // ],
    // [
    //   {
    //     name: "areaA",
    //     orientation: getRandomFromList(["x"]),
    //     OVERLAY: true,
    //     brushCount: 300,  // 100
    //     noiseIncrement: 0.9,  // 0.06 - 0.6
    //     DEBUG: false,
    //     maxSpeedMin: 5,  // 15
    //     maxSpeedMax: 10, // 20
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 40,
    //     finishedRadius: 10,
    //     // targetBdistList: [50, 100, 200],
    //     targetBdistList: [500],
    //     targetBDirectionList: [-1, 1],
    //     // targetBDirectionList: [-1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1.1,
    //     // noiseColor: [color("#252525"), color("#fcfcfc"), color("#cacaca")],
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 50,
    //     brushTemplateStrokeSize: 1,
    //     brushTemplateFillColor: color("#b8b8b883"),
    //     // brushTemplateFillColor: color("#cc1a1a83"),
    //     brushTemplateFillColorDistort: 10,
    //     brushTemplateStrokeColor: color("#6d6d6d83"),
    //     // brushTemplateStrokeColor: color("#52000083"),
    //     brushTemplateStrokeColorDistort: 40,
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   },
    //   {
    //     name: "areaA",
    //     orientation: getRandomFromList(["y"]),
    //     OVERLAY: true,
    //     brushCount: 300,  // 100
    //     noiseIncrement: 0.9,  // 0.06 - 0.6
    //     DEBUG: false,
    //     maxSpeedMin: 5,  // 15
    //     maxSpeedMax: 10, // 20
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 40,
    //     finishedRadius: 10,
    //     // targetBdistList: [50, 100, 200],
    //     targetBdistList: [500],
    //     targetBDirectionList: [-1, 1],
    //     // targetBDirectionList: [-1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1.1,
    //     // noiseColor: [color("#252525"), color("#fcfcfc"), color("#cacaca")],
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 50,
    //     brushTemplateStrokeSize: 1,
    //     brushTemplateFillColor: color("#b8b8b883"),
    //     // brushTemplateFillColor: color("#cc1a1a83"),
    //     brushTemplateFillColorDistort: 10,
    //     brushTemplateStrokeColor: color("#6d6d6d83"),
    //     // brushTemplateStrokeColor: color("#52000083"),
    //     brushTemplateStrokeColorDistort: 40,
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   },
    // ],
    // [
    //   {
    //     name: "areaB",
    //     orientation: getRandomFromList(["x"]),
    //     OVERLAY: false,
    //     brushCount: 400,
    //     noiseIncrement: 0.6,  // 0.06
    //     DEBUG: false,
    //     densityFactor: 2,
    //     maxSpeedMin: 3,
    //     maxSpeedMax: 10,
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 100,
    //     finishedRadius: 20,
    //     targetBdistList: [100, 200, 400, 600, 800],
    //     targetBDirectionList: [1, -1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1,
    //     // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //     // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 60,
    //     brushTemplateStrokeSize: 1,
    //     brushTemplateFillColor: color("#e2e2e2"),
    //     brushTemplateFillColorDistort: 20,
    //     brushTemplateStrokeColor: color("#f0f0f0"),
    //     brushTemplateStrokeColorDistort: 20,
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   },
    //   {
    //     name: "areaB",
    //     orientation: getRandomFromList(["y"]),
    //     OVERLAY: false,
    //     brushCount: 400,
    //     noiseIncrement: 0.6,  // 0.06
    //     DEBUG: false,
    //     densityFactor: 2,
    //     maxSpeedMin: 3,
    //     maxSpeedMax: 10,
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 100,
    //     finishedRadius: 20,
    //     targetBdistList: [100, 200, 400, 600, 800],
    //     targetBDirectionList: [1, -1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1,
    //     // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //     // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 60,
    //     brushTemplateStrokeSize: 1,
    //     brushTemplateFillColor: color("#e2e2e2"),
    //     brushTemplateFillColorDistort: 20,
    //     brushTemplateStrokeColor: color("#f0f0f0"),
    //     brushTemplateStrokeColorDistort: 20,
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   },
    // ],
    // [
    //   {
    //     name: "fillNoiseOverlay",
    //     orientation: getRandomFromList(["x"]),
    //     OVERLAY: true,
    //     brushCount: 300,  // 100
    //     noiseIncrement: 0.9,  // 0.06 - 0.6
    //     DEBUG: false,
    //     maxSpeedMin: 5,  // 15
    //     maxSpeedMax: 10, // 20
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 40,
    //     finishedRadius: 10,
    //     // targetBdistList: [50, 100, 200],
    //     targetBdistList: [500],
    //     targetBDirectionList: [-1, 1],
    //     // targetBDirectionList: [-1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1.1,
    //     // noiseColor: [color("#252525"), color("#fcfcfc"), color("#cacaca")],
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 50,
    //     brushTemplateStrokeSize: 1,
    //     brushTemplateFillColor: color("#b8b8b883"),
    //     // brushTemplateFillColor: color("#cc1a1a83"),
    //     brushTemplateFillColorDistort: 10,
    //     brushTemplateStrokeColor: color("#6d6d6d83"),
    //     // brushTemplateStrokeColor: color("#52000083"),
    //     brushTemplateStrokeColorDistort: 40,
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   },
    //   {
    //     name: "fillNoiseOverlay",
    //     orientation: getRandomFromList(["y"]),
    //     OVERLAY: true,
    //     brushCount: 300,  // 100
    //     noiseIncrement: 0.9,  // 0.06 - 0.6
    //     DEBUG: false,
    //     maxSpeedMin: 5,  // 15
    //     maxSpeedMax: 10, // 20
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 40,
    //     finishedRadius: 10,
    //     // targetBdistList: [50, 100, 200],
    //     targetBdistList: [500],
    //     targetBDirectionList: [-1, 1],
    //     // targetBDirectionList: [-1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1.1,
    //     // noiseColor: [color("#252525"), color("#fcfcfc"), color("#cacaca")],
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 50,
    //     brushTemplateStrokeSize: 1,
    //     brushTemplateFillColor: color("#b8b8b883"),
    //     // brushTemplateFillColor: color("#cc1a1a83"),
    //     brushTemplateFillColorDistort: 10,
    //     brushTemplateStrokeColor: color("#6d6d6d83"),
    //     // brushTemplateStrokeColor: color("#52000083"),
    //     brushTemplateStrokeColorDistort: 40,
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   },
    // ],
    // [{
    //   name: "fillNoisePart1",
    //   // originA: createVector(width / 3, height / 10),  // left, start of brushstrokes
    //   // targetA: createVector(width / 3, height / 10 * 9), // left, end of brusshtrokes
    //   // originB: createVector(width / 3 * 2, height / 10), // right, start of brushstrokes
    //   // targetB: createVector(width / 3 * 2, height / 10 * 9), // right, end of brushstrokes
    //   orientation: getRandomFromList(["x"]),
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
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
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
    // },
    // {
    //   name: "fillNoisePart2",
    //   // originA: createVector(width / 3, height / 10),  // left, start of brushstrokes
    //   // targetA: createVector(width / 3, height / 10 * 9), // left, end of brusshtrokes
    //   // originB: createVector(width / 3 * 2, height / 10), // right, start of brushstrokes
    //   // targetB: createVector(width / 3 * 2, height / 10 * 9), // right, end of brushstrokes
    //   orientation: getRandomFromList(["y"]),
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
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
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
    // },
    // ],
    // [{
    //   name: "strokeNoise",
    //   orientation: getRandomFromList(["x"]),
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
    //   // noiseColor: [color("#ebebeb")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
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
    // },
    // {
    //   name: "strokeNoise",
    //   orientation: getRandomFromList(["y"]),
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
    //   // noiseColor: [color("#ebebeb")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
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
    // },
    // ],
    // [{
    //   name: "example1",
    //   // originA: createVector(width / 8 * 3, height / 9),  // left, start of brushstrokes
    //   // targetA: createVector(width / 8 * 3, height / 9 * 8), // left, end of brusshtrokes
    //   // originB: createVector(width / 8 * 5, height / 9), // right, start of brushstrokes
    //   // targetB: createVector(width / 8 * 5, height / 9 * 8), // right, end of brushstrokes
    //   orientation: getRandomFromList(["x"]),
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
    //   // noiseColor: [color("#727272")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //   brushTemplateCount: 20,
    //   brushTemplateSize: 50,
    //   brushTemplateStrokeSize: 1,
    //   brushTemplateFillColor: color("#b8b8b883"),
    //   brushTemplateFillColorDistort: 10,
    //   brushTemplateStrokeColor: color("#6d6d6d83"),
    //   brushTemplateStrokeColorDistort: 40,
    //   brushCurveSexyness: 1,
    //   brushType: "Stroke Noise",
    // },
    // {
    //   name: "example2",
    //   // originA: createVector(width / 8 * 3, height / 9),  // left, start of brushstrokes
    //   // targetA: createVector(width / 8 * 3, height / 9 * 8), // left, end of brusshtrokes
    //   // originB: createVector(width / 8 * 5, height / 9), // right, start of brushstrokes
    //   // targetB: createVector(width / 8 * 5, height / 9 * 8), // right, end of brushstrokes
    //   orientation: getRandomFromList(["y"]),
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
    //   // noiseColor: [color("#727272")],
    //   noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //   brushTemplateCount: 20,
    //   brushTemplateSize: 50,
    //   brushTemplateStrokeSize: 1,
    //   brushTemplateFillColor: color("#b8b8b883"),
    //   brushTemplateFillColorDistort: 10,
    //   brushTemplateStrokeColor: color("#6d6d6d83"),
    //   brushTemplateStrokeColorDistort: 40,
    //   brushCurveSexyness: 1,
    //   brushType: "Stroke Noise",
    // }
    // ],
    // [
    //   {
    //     name: "esperiment1",
    //     // orientation: getRandomFromList(["x", "y"]),
    //     orientation: getRandomFromList(["x"]),
    //     OVERLAY: false,
    //     brushCount: 200, //500,  // 100 | good one 1300
    //     noiseIncrement: 0.01, // 0.006,  // 0.06 - 0.6
    //     DEBUG: false,
    //     maxSpeedMin: 20,  // 15
    //     maxSpeedMax: 50, // 20
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 320,
    //     finishedRadius: 40,
    //     // targetBdistList: [1000],
    //     targetBdistList: [200, 500, 600, 750, 1000, 2000],
    //     // targetBDirectionList: [-1],  // oida
    //     targetBDirectionList: [-1, 1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1.5,
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //     // noiseColor: [color("#fd7b2f"), color("#ffa96f"), color("#f7dcc2")],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 190,   // 50
    //     brushTemplateStrokeSize: 5,
    //     brushTemplateFillColor: color("#c9c9c9ff"),
    //     // brushTemplateFillColor: color("#cc1a1a83"),
    //     brushTemplateFillColorDistort: 20,
    //     // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    //     brushTemplateStrokeColor: color("#52000083"),
    //     // brushTemplateStrokeColorDistort: 20,  // out
    //     // brushType: "Stroke Noise",
    //     // brushType: "Gradient",  // cool
    //     // brushType: "Noise",  // 1 loop
    //     brushType: "Fill Noise",
    //     // brushType: "Only Perlin",
    //     // brushType: "Combined Perlin",  // 3 loops
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   }, {
    //     name: "esperiment2",
    //     // orientation: getRandomFromList(["x", "y"]),
    //     orientation: getRandomFromList(["y"]),
    //     OVERLAY: false,
    //     brushCount: 200, //500,  // 100
    //     noiseIncrement: 0.006,  // 0.06 - 0.6
    //     DEBUG: false,
    //     maxSpeedMin: 10,  // 15
    //     maxSpeedMax: 30, // 20
    //     minSpeed: 2,
    //     maxForce: 2,
    //     slowRadius: 320,
    //     finishedRadius: 40,
    //     // targetBdistList: [1000],
    //     targetBdistList: [200, 500, 600, 750, 1000, 2000],
    //     // targetBDirectionList: [-1],
    //     targetBDirectionList: [-1, 1],
    //     basicSizeMin: 1,
    //     basicSizeMax: 1.5,
    //     noiseColor: [color(PALETTE.darkColor), color(PALETTE.lightColor)],
    //     // noiseColor: [color("#3b3b3b"), color("#c7c7c7"), color("#ffffff")],
    //     // noiseColor: [color("#fd7b2f"), color("#ffa96f"), color("#f7dcc2")],
    //     brushTemplateCount: 20,
    //     brushTemplateSize: 190,
    //     brushTemplateStrokeSize: 1,  // out
    //     brushTemplateFillColor: color("#c9c9c9ff"),
    //     // brushTemplateFillColor: color("#cc1a1a83"),
    //     brushTemplateFillColorDistort: 20,
    //     // brushTemplateStrokeColor: color("#4b4b4bff"),  // out
    //     brushTemplateStrokeColor: color("#52000083"),
    // brushTemplateStrokeColorDistort: 20,  // out
    //     brushType: "Fill Noise",
    //     brushCurveSexyness: 1,
    //     brushPixelDistort: 50,
    //   }
    // ]
  ]


  // chosenPattern = getRandomFromList(patternProfilesUN);
  chosenPattern = getRandomFromList(patternProfiles);
  chosenNoise = new Noise();


  gridProfile = {
    stripeOrientation: getRandomFromList(["x", "y"]),
    countColumnOrRow: getRandomFromList([1, 2, 3, 4]),
    bezierFactor: getRandomFromList([0.001, 0.005, 0.007, 0.01]),
    thickness: 1,
    spacing: getRandomFromList([1, 2, 3]),
    pattern: new BrushstrokeSystem(chosenPattern[0]),
    pattern2: new BrushstrokeSystem(chosenPattern[1]),
    backgroundNoise: chosenNoise,
    whichLoopLevel: whichLoopLevel,
    // how many loopLayers with pattern
  }

  grid = new Grid(gridProfile);

  // Paper
  paper = new Paper();
  corny = new Corny();
  edgePixel = new PixelGradient();


  // FEATURES
  window.$fxhashFeatures = {
    "Format": canvasFormatChosen.name,
    // "Palette": PALETTE_LABEL,
    // "Element Count": TRIANGLECOUNT_LABEL,
    // "Element types": PICKER_LABEL,
  }

  // console.info(`fxhash: %c${fxhash}`, 'font-weight: bold');
  // console.info(`Format: %c${canvasFormatChosen.name}`, 'font-weight: bold');
  // console.info(`Stripe Orientation: %c${gridProfile.stripeOrientation}`, 'font-weight: bold');
  // console.info(`Number of rows or columns: %c${gridProfile.countColumnOrRow}`, 'font-weight: bold');
  // console.info(`Wobbly factor: %c${gridProfile.bezierFactor}`, 'font-weight: bold');
  // console.info(`Stripe thickness: %c${gridProfile.thickness}`, 'font-weight: bold');
  // console.info(`Stripe spacing: %c${gridProfile.spacing}`, 'font-weight: bold');
  // console.log('');

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

  background(PALETTE.paper);


  // PAPER
  paper.show();
  corny.show();
  edgePixel.show();


  // chosenPattern.show();
  // chosenPattern.showBrushTemplates();

  // CARDBOARD ON TOP
  grid.show();


  // PROTOTYPE SPLATTER
  push();
  let lengthFromCenterMin = 2;
  let lengthFromCenterMax = 8;
  // let changer = 100;
  let loopCount = 1000;

  let blob = createGraphics(width, height);
  for (var i = 0; i < loopCount; i++) {

    let pointX = createVector(getRandomFromInterval(0, width), getRandomFromInterval(0, height));
    let pointA = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1, getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1));
    let pointB = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax), getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1));
    let pointC = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax), getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax)));
    let pointD = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1, getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax)));

    // DEBUG
    // strokeWeight(40);
    // point(pointX.x, pointX.y);
    // point(pointA.x, pointA.y);
    // point(pointB.x, pointB.y);
    // point(pointC.x, pointC.y);
    // point(pointD.x, pointD.y);

    blob.fill(color(130, 255));
    // blob.fill(PALETTE.cardboard);
    blob.noStroke();

    blob.beginShape();

    blob.vertex(pointA.x, pointA.y);
    // blob.bezierVertex(pointB.x, pointB.y, pointB.x, pointB.y, pointB.x, pointB.y);
    blob.vertex(pointB.x, pointB.y);
    blob.vertex(pointC.x, pointC.y);
    blob.vertex(pointD.x, pointD.y);
    blob.endShape(CLOSE);
  }
  blendMode(OVERLAY);
  image(blob, 0, 0);
  pop();



  // DEBUG
  if (oida) {
    new BrushstrokeSystem(chosenPattern[0]).show();
  }

  fxpreview();
  noLoop();

  if (BULK) {
    exportCanvas(canvas);
  }

}

function mousePressed() {
}


if (BULK) {
  setTimeout(reloader, 10000)
}
