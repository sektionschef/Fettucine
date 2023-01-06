class BrushSystem {
    constructor(data) {

        this.brushCount = data.brushCount;

        this.originA = createVector(width / 3, height / 9);
        this.targetA = createVector(width / 3, height / 9 * 8);
        this.allFinished = false;

        this.buffer = createGraphics(width, height);
        this.brushstrokes = [];

        for (var i = 0; i < this.brushCount; i++) {
            this.brushstrokes.push(new Brushstroke({
                origin: p5.Vector.add(this.originA, i * 20),
                target: p5.Vector.add(this.targetA, i * 20),
                sprite: data.brushBuffer,  // GLOBAL - integrate in class
                drawBuffer: this.buffer
            }));
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
    }
}