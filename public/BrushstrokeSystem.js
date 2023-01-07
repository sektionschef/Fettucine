class BrushstrokeSystem {
    constructor(data) {

        this.originA = data.originA;
        this.targetA = data.targetA;
        this.originB = data.originB;
        this.targetB = data.targetB;
        this.densityFactor = data.densityFactor;
        this.DEBUG = false;

        // calc for loop
        this.distanceAB = p5.Vector.dist(this.originA, this.originB);
        this.brushCount = this.distanceAB / this.densityFactor;
        // console.log(this.brushCount);

        this.allFinished = false;
        this.buffer = createGraphics(width, height);
        this.brushstrokes = [];

        for (var i = 0; i < this.brushCount; i++) {

            data.origin = p5.Vector.add(this.originA, i * this.densityFactor);
            data.target = p5.Vector.add(this.targetA, i * this.densityFactor);
            // specificData.sprite = data.brushBuffer;  // GLOBAL - integrate in class
            data.drawBuffer = this.buffer;

            this.brushstrokes.push(new Brushstroke(data));
        }

        this.create();
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
        if (this.allFinished) {
            image(this.buffer, 0, 0);
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