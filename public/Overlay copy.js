class Overlay {
    constructor(colorObject) {

        this.overlayColor = color(colorObject);
        this.curveSexyness = 1.1;
        this.noiseWeight = 5;
        this.noiseColor = color("black");
        this.buffer = createGraphics(width, height);

        this.buffer.curveTightness(this.curveSexyness);

        this.offsetMin = 0.99;
        this.offsetMax = 1.01;
        this.randomOffset1 = getRandomFromInterval(this.offsetMin, this.offsetMax);
        this.randomOffset2 = getRandomFromInterval(this.offsetMin, this.offsetMax);
        this.randomOffset3 = getRandomFromInterval(this.offsetMin, this.offsetMax);
        this.randomOffset4 = getRandomFromInterval(this.offsetMin, this.offsetMax);
        this.randomOffset5 = getRandomFromInterval(this.offsetMin, this.offsetMax);
        this.randomOffset6 = getRandomFromInterval(this.offsetMin, this.offsetMax);

        this.A = createVector(0 - width * 1.1, height / 8 * 3);
        this.A1 = createVector(width / 9 * 2, height / 8 * 3 * this.randomOffset1);
        this.A2 = createVector(width / 9 * 5, height / 8 * 3 * this.randomOffset2);
        this.A3 = createVector(width / 9 * 7, height / 8 * 3 * this.randomOffset3);
        this.B = createVector(width * 1.1, height / 8 * 3);
        this.C = createVector(width * 1.1, height / 8 * 5);
        this.C1 = createVector(width / 9 * 7, height / 8 * 5 * this.randomOffset4);
        this.C2 = createVector(width / 9 * 5, height / 8 * 5 * this.randomOffset5);
        this.C3 = createVector(width / 9 * 2, height / 8 * 5 * this.randomOffset6);
        this.D = createVector(0 - width * 1.1, height / 8 * 5);

        this.coverOverlay();

        // this.createBackgroundFold();
        // this.createUpperLine();
        // this.createLowerLine();
        // this.noise()
    }

    noise() {
        this.pointCount = 60000;

        var stats1 = getSteep(this.A, this.A1);
        var stats2 = getSteep(this.A1, this.A2);
        var stats3 = getSteep(this.A2, this.A3);
        var stats4 = getSteep(this.A3, this.B);


        for (var i = 0; i < this.pointCount; i++) {


            let x = getRandomFromInterval(0, width);
            let offset = randomGaussian(0, (this.A.y - this.D.y) / 4);
            // let y = height / 8 * 3 + abs(offset);
            if (x > this.A.x & x < this.A1.x) {
                this.baseY = stats1[0] * x + stats1[1]
            } else if (x > this.A1.x & x < this.A2.x) {
                this.baseY = stats2[0] * x + stats2[1]
            } else if (x > this.A2.x & x < this.A3.x) {
                this.baseY = stats3[0] * x + stats3[1]
            } else {
                this.baseY = stats4[0] * x + stats4[1]
            }
            let y = this.baseY + abs(offset);

            this.buffer.push()
            this.buffer.stroke(this.noiseColor);
            this.buffer.strokeWeight(this.noiseWeight);
            this.buffer.point(x, y);
            this.buffer.pop();
        }

    }

    createBackgroundFold() {
        this.buffer.push();
        this.buffer.noStroke();
        this.buffer.fill(this.overlayColor)

        this.buffer.beginShape();
        this.buffer.curveVertex(this.A.x, this.A.y);
        this.buffer.curveVertex(this.A.x, this.A.y);
        this.buffer.curveVertex(this.A1.x, this.A1.y);
        this.buffer.curveVertex(this.A2.x, this.A2.y);
        this.buffer.curveVertex(this.A3.x, this.A3.y);
        this.buffer.curveVertex(this.B.x, this.B.y);
        this.buffer.curveVertex(this.C.x, this.C.y);
        this.buffer.curveVertex(this.C1.x, this.C1.y);
        this.buffer.curveVertex(this.C2.x, this.C2.y);
        this.buffer.curveVertex(this.C3.x, this.C3.y);
        this.buffer.curveVertex(this.D.x, this.D.y);
        this.buffer.curveVertex(this.D.x, this.D.y);
        this.buffer.endShape();
        this.buffer.pop();
    }

    createUpperLine() {
        this.buffer.push();
        this.buffer.stroke(color("#111111"));
        this.buffer.strokeWeight(6);
        this.buffer.noFill();

        this.buffer.beginShape();
        this.buffer.curveVertex(this.A.x, this.A.y);
        this.buffer.curveVertex(this.A.x, this.A.y);
        this.buffer.curveVertex(this.A1.x, this.A1.y);
        this.buffer.curveVertex(this.A2.x, this.A2.y);
        this.buffer.curveVertex(this.A3.x, this.A3.y);
        this.buffer.curveVertex(this.B.x, this.B.y);
        this.buffer.curveVertex(this.B.x, this.B.y);
        this.buffer.endShape();
        this.buffer.pop();
    }

    createLowerLine() {
        this.buffer.push();
        this.buffer.stroke(color("#9e9e9e"));
        this.buffer.strokeWeight(6);
        this.buffer.noFill();

        this.buffer.beginShape();
        this.buffer.curveVertex(this.C.x, this.C.y);
        this.buffer.curveVertex(this.C.x, this.C.y);
        this.buffer.curveVertex(this.C1.x, this.C1.y);
        this.buffer.curveVertex(this.C2.x, this.C2.y);
        this.buffer.curveVertex(this.C3.x, this.C3.y);
        this.buffer.curveVertex(this.D.x, this.D.y);
        this.buffer.curveVertex(this.D.x, this.D.y);
        this.buffer.endShape();
        this.buffer.pop();
    }

    coverOverlay() {
        // OVERLAY TO DINGS
        this.buffer.noStroke();
        // this.buffer.stroke(50);
        this.buffer.fill(this.overlayColor);

        // top
        this.buffer.beginShape();
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, height / 8 * 3);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 4, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        this.buffer.curveVertex(width, height / 8 * 3);
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width, 0);
        this.buffer.endShape();

        // left
        this.buffer.beginShape();
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(width / 8 * 4, 0);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 4);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height);
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height);
        this.buffer.endShape();

        // bottom
        this.buffer.beginShape();
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height / 8 * 6);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        this.buffer.curveVertex(width, height / 8 * 6);
        this.buffer.curveVertex(width, height);
        this.buffer.curveVertex(width, height);
        this.buffer.endShape();

        // right
        this.buffer.beginShape();
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width / 8 * 4, 0);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 4);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height);
        this.buffer.curveVertex(width, height);
        this.buffer.curveVertex(width, height);
        this.buffer.endShape();
    }

    show() {
        push();
        // blendMode(OVERLAY);
        image(this.buffer, 0, 0);
        pop();
    }
}