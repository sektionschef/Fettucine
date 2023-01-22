class Paper {
    constructor() {
        this.width = 800;
        this.height = 800;

        this.strokeColor = color("#1d1d1d");
        this.strokeSize = 1;
        this.lineLength = 25; // 5 +2

        this.xCount = Math.ceil(width / this.width);
        this.yCount = Math.ceil(height / this.height);

        this.buffer = createGraphics(this.width, this.height);
        this.create();
    }

    create() {
        for (var i = 0; i < 10000; i++) {
            let A = createVector(getRandomFromInterval(0, this.width), getRandomFromInterval(0, this.height));
            let theta = getRandomFromInterval(0, 2 * PI);
            let segmentLength = getRandomFromInterval(2, this.lineLength);  // fxrand() * 5 + 2
            let B = createVector(Math.cos(theta) * segmentLength + A.x, Math.sin(theta) * segmentLength + A.y);

            this.buffer.stroke(this.strokeColor);
            this.buffer.strokeWeight(this.strokeSize);
            this.buffer.line(A.x, A.y, B.x, B.y);

            // repeat for seamless pattern
            if (B.x > this.width) {
                B.x -= this.width;
                A.x -= this.width;
                this.buffer.line(A.x, A.y, B.x, B.y);
            }

            if (B.y > this.height) {
                B.y -= this.height;
                A.y -= this.height;
                this.buffer.line(A.x, A.y, B.x, B.y);
            }
        }
    }



    show(buffer) {
        for (var y = 0; y < this.yCount; y++) {
            for (var x = 0; x < this.xCount; x++) {
                if (buffer) {
                    buffer.push();
                    buffer.blendMode(OVERLAY);
                    buffer.translate(x * this.buffer.width, y * this.buffer.height);
                    buffer.image(this.buffer, 0, 0);
                    buffer.pop();
                } else {
                    push();
                    blendMode(OVERLAY);
                    translate(x * this.buffer.width, y * this.buffer.height);
                    image(this.buffer, 0, 0);
                    pop();
                }
            }
        }
    }
}