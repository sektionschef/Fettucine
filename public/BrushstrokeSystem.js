class BrushstrokeSystem {
    constructor(data) {
        this.orientation = data.orientation;
        this.brushCount = data.brushCount;
        this.brushTemplateCount = data.brushTemplateCount;
        this.brushTemplateSize = data.brushTemplateSize;
        this.brushTemplateStrokeSize = data.brushTemplateStrokeSize;
        this.brushTemplateFillColor = data.brushTemplateFillColor;
        this.brushTemplateFillColorDistort = data.brushTemplateFillColorDistort;
        this.brushTemplateStrokeColor = data.brushTemplateStrokeColor;
        this.brushTemplateStrokeColorDistort = data.brushTemplateStrokeColorDistort;
        this.brushCurveSexyness = data.brushCurveSexyness
        this.noiseIncrement = data.noiseIncrement;
        this.DEBUG = data.DEBUG;
        this.noiseColor = data.noiseColor;
        this.brushPixelDistort = data.brushPixelDistort;
        this.brushOpacityDistort = data.brushOpacityDistort;
        this.brushType = data.brushType;

        if (this.orientation == "x") {
            // starts from origin to target, A to B is direction of parallell strokes
            this.originA = createVector(0, height);  // left, start of brushstrokes
            this.targetA = createVector(width, height); // left, end of brusshtrokes
            this.originB = createVector(0, 0); // right, start of brushstrokes
            this.targetB = createVector(width, 0); // right, end of brushstrokes
        } else {
            // y
            this.originA = createVector(width / 10 * 0, height / 10 * 0);  // left, start of brushstrokes
            this.targetA = createVector(width / 10 * 0, height / 10 * 10); // left, end of brusshtrokes
            this.originB = createVector(width / 10 * 10, height / 10 * 0); // right, start of brushstrokes
            this.targetB = createVector(width / 10 * 10, height / 10 * 10); // right, end of brushstrokes
        }

        // calc for loop
        this.distanceAB = p5.Vector.dist(this.originA, this.originB);
        this.densityFactor = this.distanceAB / this.brushCount;
        this.loopGrow = p5.Vector.sub(this.originB, this.originA).normalize();  // in which the direction the loop grows

        this.allFinished = false;
        this.buffer = createGraphics(width, height);
        this.brushTemplates = [];
        this.brushstrokes = [];

        this.createBrushTemplates();

        let increment = 0;


        for (var i = 0; i < this.brushCount; i++) {

            // console.log(i * this.densityFactor);
            // data.origin = p5.Vector.add(this.originA, i * this.densityFactor);
            data.origin = p5.Vector.add(this.originA, p5.Vector.mult(this.loopGrow, i * this.densityFactor));
            // console.log(data.origin);
            // data.target = p5.Vector.add(this.targetA, i * this.densityFactor);
            data.target = p5.Vector.add(this.targetA, p5.Vector.mult(this.loopGrow, i * this.densityFactor));
            // specificData.sprite = data.brushBuffer;  // GLOBAL - integrate in class

            // VAR A
            data.sprite = getRandomFromList(this.brushTemplates);
            // VAR B
            // let what = Math.round(noise(increment) * this.brushTemplates.length);
            // data.sprite = this.brushTemplates[what];

            data.drawBuffer = this.buffer;

            increment = increment + this.noiseIncrement;
            data.turningFactor = noise(increment) * 1;
            data.brushIndex = i;

            this.brushstrokes.push(new Brushstroke(data));
        }

        // DISABLE for active drawing
        this.create();
    }

    createBrushTemplates() {

        for (var i = 0; i < this.brushTemplateCount; i++) {
            var BrushData = {
                noiseColor: this.noiseColor,
                size: this.brushTemplateSize,
                strokeSize: this.brushTemplateStrokeSize,
                fillColor: distortColorSuperNew(this.brushTemplateFillColor, this.brushTemplateFillColorDistort),
                strokeColor: distortColorSuperNew(this.brushTemplateStrokeColor, this.brushTemplateStrokeColorDistort),
                curveSexyness: this.brushCurveSexyness,
                pixelDistort: this.brushPixelDistort,
                type: this.brushType,
            }
            this.brushTemplates.push(new Brush(BrushData).buffer);
        }
    }

    showBrushTemplates() {
        // for debugging - list them all
        for (var i = 0; i < this.brushTemplates.length; i++) {
            image(this.brushTemplates[i], i * this.brushTemplates[i].width, 0);
        }
    }

    check_all_complete() {

        if (this.allFinished == false || this.brushstrokes.length > 0) {

            this.brushstrokes_alive = [];
            for (var brushstroke of this.brushstrokes) {
                this.brushstrokes_alive.push(brushstroke.finished);
            }
            if (this.brushstrokes_alive.every(element => element === true)) {
                this.allFinished = true;
                // console.log("finished!")
            }
        }
    }

    create() {
        // DISABLE for active drawing
        while (this.allFinished == false) {
            for (var i = 0; i < this.brushstrokes.length; i++) {
                var brushNow = this.brushstrokes[i];

                if (brushNow.finished == false) {
                    brushNow.updateBrushstroke();
                    brushNow.showBrushstroke();
                    brushNow.applyForce(brushNow.seek(true));  // moving_target = true
                }
            }
            this.check_all_complete();
        }

    }

    show() {
        // DISABLE for active drawing
        if (this.allFinished) {
            push();
            // blendMode(OVERLAY);
            image(this.buffer, 0, 0);
            pop();
        }

        if (this.DEBUG) {
            // origin DEBUG        
            push();
            translate(this.originA.x, this.originA.y);
            fill(color("orange"));
            noStroke();
            circle(0, 0, 50);
            pop();

            // target DEBUG        
            push();
            translate(this.targetA.x, this.targetA.y);
            fill(color("green"));
            noStroke();
            circle(0, 0, 50);
            pop();

            // origin DEBUG        
            push();
            translate(this.originB.x, this.originB.y);
            fill(color("orange"));
            noStroke();
            circle(0, 0, 50);
            pop();

            // target DEBUG        
            push();
            translate(this.targetB.x, this.targetB.y);
            fill(color("green"));
            noStroke();
            circle(0, 0, 50);
            pop();
        }
    }
}