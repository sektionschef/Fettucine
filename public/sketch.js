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
  let type = "Fill Noise"//getRandomFromList(["Stroke Noise", "Gradient", "Noise", "Fill Noise", "Only Perlin", "Combined Perlin"]);
  let county = Math.round(getRandomFromInterval(50, 500)); // 500, 300;
  let manouvre = getRandomFromList([[50, 100, 300], [100, 300, 500], [500, 750, 1000, 2000]]);  // UPDOWN [50], [100], [500, 750, 1000, 2000]
  let directions = getRandomFromList([[-1, 1], [1], [-1]]);
  let noiseIncrement = getRandomFromList([0.01, 0.06, 0.6]);
  let whichLoopLevel = "last"; // getRandomFromList(["last", "secondlast", "thirdlast"])
  let overlay = false // getRandomFromList([true, false]);
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
  patternProfiles = [
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
