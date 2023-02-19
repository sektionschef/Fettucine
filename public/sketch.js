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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  setSpartaHTML();
  setTagsHTML();

  if (urlParams.has('senza')) {
    if (urlParams.get("senza") === "true") {
      addStyleSheet("styles_senza.css");
    } else {
      addStyleSheet("styles.css");
    }
  } else {
    addStyleSheet("styles.css");
  }

  // if (urlParams.has('infinity')) {
  //   INFINITYSTRING = urlParams.get('infinity');
  //   INFINITY = (INFINITYSTRING === 'true');
  // }
  // console.log("INFINITY: " + INFINITY);

  // if (urlParams.has('animated')) {
  //     if (urlParams.get("animated") === "false") {
  //         ANIMATIONSTATE = false;
  //     }
  // }

  if (urlParams.has('res')) {
    CURRENTPIXELDENS = +urlParams.get("res");
  }
  console.log("resolution: " + CURRENTPIXELDENS + "x");
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

  // oida = false;

  brushType = getRandomFromList(["Stroke Noise", "Gradient", "Noise", "Fill Noise", "Only Perlin", "Combined Perlin"]);

  // OVERRIDE
  if (brushType == "Noise" && PALETTE_LABEL == "Emmerald") {
    overlay = false;
  } else {
    overlay = getRandomFromList([true, false])
  }

  patternProfileX = {
    orientation: "x",
    OVERLAY: overlay,
    brushCount: Math.round(getRandomFromInterval(50, 500)),
    noiseIncrement: getRandomFromList([0.01, 0.06, 0.6, 0.9]),
    DEBUG: false,
    maxSpeedMin: Math.round(getRandomFromInterval(5, 15)),
    maxSpeedMax: Math.round(getRandomFromInterval(15, 30)),
    minSpeed: 2,
    maxForce: 2,
    slowRadius: 320,
    finishedRadius: 40,
    targetBdistList: getRandomFromList([[50, 100, 300], [100, 300, 500], [500, 750, 1000]]),
    targetBDirectionList: getRandomFromList([[-1, 1], [1], [-1]]),
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
    brushType: brushType,
    brushCurveSexyness: 1,
    brushPixelDistort: 50,
  }
  patternProfileY = { ...patternProfileX };
  patternProfileY.orientation = "y";

  gridProfile = {
    stripeOrientation: getRandomFromList(["x", "y"]),
    countColumnOrRow: getRandomFromList([1, 2, 3, 4]),
    bezierFactor: getRandomFromList([0.001, 0.005, 0.007]),
    thickness: 1,
    spacing: getRandomFromList([1, 2, 3]),
    pattern: new BrushstrokeSystem(patternProfileX),
    pattern2: new BrushstrokeSystem(patternProfileY),
    backgroundNoise: new Noise(),
    whichLoopLevel: getRandomFromList(["last", "secondlast", "thirdlast"]),
  }

  grid = new Grid(gridProfile);

  // Paper
  paper = new Paper();
  corny = new Corny();
  edgePixel = new PixelGradient();


  // FEATURES
  window.$fxhashFeatures = {
    "Format": canvasFormatChosen.name,
    "Palette": PALETTE_LABEL,
    "Stripe Orientation": gridProfile.stripeOrientation,
    "Column/Row count": gridProfile.countColumnOrRow,
    "Stripe spacing": gridProfile.spacing,
    "Edge fuzzyness": gridProfile.bezierFactor,
    "Brush Type": patternProfileX.brushType,
    // "Brush Count": patternProfileX.brushCount,
    // "Brush target movement": patternProfileX.targetBdistList,
    // "Brush target direction": patternProfileX.targetBDirectionList,
    // "Noise increment": patternProfileX.noiseIncrement,
    // "Pattern loop level": gridProfile.whichLoopLevel,
    // "Overlay": patternProfileX.OVERLAY,
    // "Brush Min speed": patternProfileX.maxSpeedMin,
    // "Brush Max speed": patternProfileX.maxSpeedMax,
  }

  console.log(window.$fxhashFeatures);
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
  // push();
  // let lengthFromCenterMin = 2;
  // let lengthFromCenterMax = 8;
  // // let changer = 100;
  // let loopCount = 1000;

  // let blob = createGraphics(width, height);
  // for (var i = 0; i < loopCount; i++) {

  //   let pointX = createVector(getRandomFromInterval(0, width), getRandomFromInterval(0, height));
  //   let pointA = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1, getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1));
  //   let pointB = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax), getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1));
  //   let pointC = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax), getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax)));
  //   let pointD = p5.Vector.sub(pointX, createVector(getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax) * -1, getRandomFromInterval(lengthFromCenterMin, lengthFromCenterMax)));

  //   // DEBUG
  //   // strokeWeight(40);
  //   // point(pointX.x, pointX.y);
  //   // point(pointA.x, pointA.y);
  //   // point(pointB.x, pointB.y);
  //   // point(pointC.x, pointC.y);
  //   // point(pointD.x, pointD.y);

  //   blob.fill(color(130, 255));
  //   // blob.fill(PALETTE.cardboard);
  //   blob.noStroke();

  //   blob.beginShape();

  //   blob.vertex(pointA.x, pointA.y);
  //   // blob.bezierVertex(pointB.x, pointB.y, pointB.x, pointB.y, pointB.x, pointB.y);
  //   blob.vertex(pointB.x, pointB.y);
  //   blob.vertex(pointC.x, pointC.y);
  //   blob.vertex(pointD.x, pointD.y);
  //   blob.endShape(CLOSE);
  // }
  // blendMode(OVERLAY);
  // image(blob, 0, 0);
  // pop();


  // DEBUG
  // showFxhashFeatures();


  // DEBUG
  // if (oida) {
  //   new BrushstrokeSystem(chosenPattern[0]).show();
  // }

  fxpreview();
  noLoop();

  if (BULK) {
    exportCanvas(canvas);
  }

}

function mousePressed() {
}


if (BULK) {
  setTimeout(reloader, 30000)
}
