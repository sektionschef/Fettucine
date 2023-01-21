class BrushstrokeSystem {
    constructor(data) {

        this.originA = data.originA;
        this.targetA = data.targetA;
        this.originB = data.originB;
        this.targetB = data.targetB;
        // this.densityFactor = data.densityFactor;
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

        // calc for loop
        this.distanceAB = p5.Vector.dist(this.originA, this.originB);
        this.densityFactor = this.distanceAB / this.brushCount;

        this.allFinished = false;
        this.buffer = createGraphics(width, height);
        this.brushTemplates = [];
        this.brushstrokes = [];

        this.createBrushTemplates();

        let increment = 0;

        for (var i = 0; i < this.brushCount; i++) {

            data.origin = p5.Vector.add(this.originA, i * this.densityFactor);
            data.target = p5.Vector.add(this.targetA, i * this.densityFactor);
            // specificData.sprite = data.brushBuffer;  // GLOBAL - integrate in class
            data.sprite = getRandomFromList(this.brushTemplates);
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
                size: this.brushTemplateSize,
                strokeSize: this.brushTemplateStrokeSize,
                fillColor: distortColorSuperNew(this.brushTemplateFillColor, this.brushTemplateFillColorDistort),
                strokeColor: distortColorSuperNew(this.brushTemplateStrokeColor, this.brushTemplateStrokeColorDistort),
                curveSexyness: this.brushCurveSexyness,
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