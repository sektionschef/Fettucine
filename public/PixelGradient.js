class PixelGradient {
    constructor() {
        this.A = createVector(width / 8 * 3, height / 8 * 3);
        this.B = createVector(width / 8 * 6, height / 8 * 3);
        this.C = createVector(width / 8 * 6, height / 8 * 6);
        this.D = createVector(width / 8 * 3, height / 8 * 6);

        this.strokeColor = color("black");
        this.strokeWeight = 1;
        this.pointCount = 1000000;

        this.buffer = createGraphics(width, height);
        this.create();
    }

    create() {
        // debug
        // this.buffer.rect(this.A.x, this.A.y, p5.Vector.dist(this.B, this.A), p5.Vector.dist(this.C, this.B));

        for (var i = 0; i < this.pointCount; i++) {

            let x = getRandomFromInterval(this.A.x, this.B.x);
            let y = getRandomFromInterval(this.B.y, this.C.y);

            if (fxrand() < map(x, this.A.x, this.B.x, 0, 1)) {
                this.buffer.push();
                this.buffer.stroke(this.strokeColor);
                this.buffer.strokeWeight(this.strokeWeight);
                this.buffer.point(x, y);
                this.buffer.pop();
            }
        }
    }

    show() {
        push();
        image(this.buffer, 0, 0);
        pop();
    }
}