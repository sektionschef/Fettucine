class PixelGradient {
    constructor() {
        // this.A = createVector(width / 8 * 3, height / 8 * 3);
        // this.B = createVector(width / 8 * 6, height / 8 * 3);
        // this.C = createVector(width / 8 * 6, height / 8 * 6);
        // this.D = createVector(width / 8 * 3, height / 8 * 6);

        this.A = createVector(0, 0);
        this.B = createVector(width, 0);
        this.C = createVector(width, height);
        this.D = createVector(0, height);

        this.center = createVector(width / 2, height / 2);

        this.strokeColor = color("#272727");
        this.strokeWeight = 7;
        this.pointCount = 10000;

        this.buffer = createGraphics(width, height);
        this.create();
    }

    create() {
        // debug
        // this.buffer.fill(color("#555555"));
        // this.buffer.rect(0, height / 6 * 2, width, height / 6 * 2);
        // this.buffer.stroke()

        for (var i = 0; i < this.pointCount; i++) {

            // let x = getRandomFromInterval(this.A.x, this.B.x);
            // let y = getRandomFromInterval(this.B.y, this.C.y);

            // let point = createVector(x, y);

            // if (fxrand() < map(x, this.A.x, this.B.x, 0, 1)) {  // more noise to the right

            // if (fxrand() < map(p5.Vector.dist(this.center, point), (width / 2), p5.Vector.dist(this.center, this.A), 0, 1)) {  // more noise to the right
            //     this.buffer.push();
            //     this.buffer.stroke(this.strokeColor);
            //     this.buffer.strokeWeight(this.strokeWeight);
            //     this.buffer.point(x, y);
            //     this.buffer.pop();
            // }

            let x = randomGaussian(this.buffer.width / 2, DOMINANTSIDE / 8);
            let y = randomGaussian(this.buffer.height / 2, DOMINANTSIDE / 8);

            this.buffer.push()
            this.buffer.stroke(this.strokeColor);
            this.buffer.strokeWeight(this.strokeWeight);
            this.buffer.point(x, y);
            this.buffer.pop();
        }
    }

    show() {
        push();
        blendMode(OVERLAY);
        image(this.buffer, -this.buffer.width / 2, -this.buffer.height / 2);
        image(this.buffer, this.buffer.width - this.buffer.width / 2, -this.buffer.height / 2);
        image(this.buffer, this.buffer.width - this.buffer.width / 2, this.buffer.height - this.buffer.height / 2);
        image(this.buffer, -this.buffer.width / 2, this.buffer.height - this.buffer.height / 2);
        // image(this.buffer, 0, 0);
        // image(this.buffer, 0, 0);
        // image(this.buffer, 0, 0);
        pop();
    }
}