class Paper {
    constructor() {
        this.buffer = createGraphics(width, height);
        this.strokeColor = color("black");
        this.strokeSize = 1;
        this.lineLenght = 25; // 5 +2

        this.create();
    }

    create() {
        for (var i = 0; i < 1000000; i++) {
            let A = createVector(getRandomFromInterval(0, width), getRandomFromInterval(0, height));
            let theta = fxrand() * 2 * PI;
            let segmentLength = fxrand() * this.lineLenght;  // fxrand() * 5 + 2
            let B = createVector(Math.cos(theta) * segmentLength + A.x, Math.sin(theta) * segmentLength + A.y);

            this.buffer.stroke(this.strokeColor);
            this.buffer.strokeWeight(this.strokeSize);
            this.buffer.line(A.x, A.y, B.x, B.y);
        }
    }

    show() {
        blendMode(OVERLAY);
        image(this.buffer, 0, 0);
        blendMode(NORMAL);
    }
}