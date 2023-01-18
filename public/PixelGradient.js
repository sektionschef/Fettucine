class PixelGradient {
    constructor() {
        this.A = createVector(0, 0);
        this.B = createVector(width, 0);
        this.C = createVector(width, height);
        this.D = createVector(0, height);

        this.center = createVector(width / 2, height / 2);

        this.strokeColor = color("#444444");
        this.strokeWeight = 6;
        this.pointCount = 100000;

        this.buffer = createGraphics(width, height);
        this.create();
    }

    create() {
        // debug
        // this.buffer.fill(color("#555555"));
        // this.buffer.rect(0, height / 6 * 2, width, height / 6 * 2);
        // this.buffer.stroke()

        for (var i = 0; i < this.pointCount; i++) {

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
        // move it to the edges
        push();
        blendMode(OVERLAY);
        image(this.buffer, -this.buffer.width / 2, -this.buffer.height / 2);
        image(this.buffer, this.buffer.width - this.buffer.width / 2, -this.buffer.height / 2);
        image(this.buffer, this.buffer.width - this.buffer.width / 2, this.buffer.height - this.buffer.height / 2);
        image(this.buffer, -this.buffer.width / 2, this.buffer.height - this.buffer.height / 2);
        pop();
    }
}