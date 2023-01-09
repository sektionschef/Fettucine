class Overlay {
    constructor(colorObject) {

        this.overlayColor = color(colorObject);
        this.curveSexyness = 1.1;
        this.buffer = createGraphics(width, height);

        this.buffer.curveTightness(this.curveSexyness);

        // // OVERLAY TO DINGS
        // this.buffer.noStroke();
        // this.buffer.fill(this.overlayColor)

        // // top
        // this.buffer.beginShape();
        // this.buffer.curveVertex(0, 0);
        // this.buffer.curveVertex(0, 0);
        // this.buffer.curveVertex(0, height / 8 * 3);
        // this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        // this.buffer.curveVertex(width / 8 * 4, height / 8 * 1);
        // this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        // this.buffer.curveVertex(width, height / 8 * 3);
        // this.buffer.curveVertex(width, 0);
        // this.buffer.curveVertex(width, 0);
        // this.buffer.endShape();

        // // left
        // this.buffer.beginShape();
        // this.buffer.curveVertex(0, 0);
        // this.buffer.curveVertex(0, 0);
        // this.buffer.curveVertex(width / 8 * 4, 0);
        // this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        // this.buffer.curveVertex(width / 8 * 3, height / 8 * 4);
        // this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        // this.buffer.curveVertex(width / 8 * 4, height);
        // this.buffer.curveVertex(0, height);
        // this.buffer.curveVertex(0, height);
        // this.buffer.endShape();

        // // bottom
        // this.buffer.beginShape();
        // this.buffer.curveVertex(0, height);
        // this.buffer.curveVertex(0, height);
        // this.buffer.curveVertex(0, height / 8 * 6);
        // this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        // this.buffer.curveVertex(width / 8 * 4, height / 8 * 7);
        // this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        // this.buffer.curveVertex(width, height / 8 * 6);
        // this.buffer.curveVertex(width, height);
        // this.buffer.curveVertex(width, height);
        // this.buffer.endShape();

        // // right
        // this.buffer.beginShape();
        // this.buffer.curveVertex(width, 0);
        // this.buffer.curveVertex(width, 0);
        // this.buffer.curveVertex(width / 8 * 4, 0);
        // this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        // this.buffer.curveVertex(width / 8 * 5, height / 8 * 4);
        // this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        // this.buffer.curveVertex(width / 8 * 4, height);
        // this.buffer.curveVertex(width, height);
        // this.buffer.curveVertex(width, height);
        // this.buffer.endShape();

        this.buffer.push();
        this.buffer.noStroke();
        this.buffer.fill(this.overlayColor)

        // BACKGROUND FOLD
        this.buffer.beginShape();
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 3);
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 3);
        this.buffer.curveVertex(width / 9 * 2, height / 8 * 3 * 1.01);
        this.buffer.curveVertex(width / 9 * 5, height / 8 * 3 * 0.99);
        this.buffer.curveVertex(width / 9 * 7, height / 8 * 3);
        this.buffer.curveVertex(width * 1.1, height / 8 * 3);
        this.buffer.curveVertex(width * 1.1, height / 8 * 5);
        this.buffer.curveVertex(width / 9 * 7, height / 8 * 5);
        this.buffer.curveVertex(width / 9 * 5, height / 8 * 5 * 0.99);
        this.buffer.curveVertex(width / 9 * 2, height / 8 * 5 * 1.01);
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 5);
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 5);
        this.buffer.endShape();
        this.buffer.pop();

        // UPPER LINE
        this.buffer.push();
        this.buffer.stroke(color("#111111"));
        this.buffer.strokeWeight(6);
        this.buffer.noFill();

        this.buffer.beginShape();
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 3);
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 3);
        this.buffer.curveVertex(width / 9 * 2, height / 8 * 3 * 1.01);
        this.buffer.curveVertex(width / 9 * 5, height / 8 * 3 * 0.99);
        this.buffer.curveVertex(width / 9 * 7, height / 8 * 3);
        this.buffer.curveVertex(width * 1.1, height / 8 * 3);
        this.buffer.curveVertex(width * 1.1, height / 8 * 3);
        this.buffer.endShape();
        this.buffer.pop();

        // LOWER LINE
        this.buffer.push();
        this.buffer.stroke(color("#9e9e9e"));
        this.buffer.strokeWeight(6);
        this.buffer.noFill();

        this.buffer.beginShape();
        this.buffer.curveVertex(width * 1.1, height / 8 * 5);
        this.buffer.curveVertex(width * 1.1, height / 8 * 5);
        this.buffer.curveVertex(width / 9 * 7, height / 8 * 5);
        this.buffer.curveVertex(width / 9 * 5, height / 8 * 5 * 0.99);
        this.buffer.curveVertex(width / 9 * 2, height / 8 * 5 * 1.01);
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 5);
        this.buffer.curveVertex(0 - width * 1.1, height / 8 * 5);
        this.buffer.endShape();
        this.buffer.pop();


        this.noise()
    }

    noise() {
        this.pointCount = 10000;

        for (var i = 0; i < this.pointCount; i++) {

            let offset = randomGaussian(0, (height / 8 * 5 - height / 8 * 3) / 4);
            let y = height / 8 * 3 + abs(offset);
            let x = getRandomFromInterval(0, width);

            this.buffer.push()
            this.buffer.stroke(color("black"));
            this.buffer.strokeWeight(5);
            this.buffer.point(x, y);
            this.buffer.pop();
        }
    }


    show() {
        push();
        blendMode(OVERLAY);
        image(overlay.buffer, 0, 0);
        pop();
    }
}