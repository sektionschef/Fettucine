class Paper {
    constructor() {
        this.width = 500;
        this.height = 500;

        this.buffers = [];
        this.strokeColor = color("#1d1d1d");
        this.strokeSize = 1;
        this.lineLength = 25; // 5 +2

        this.xCount = Math.ceil(width / this.width);
        this.yCount = Math.ceil(height / this.height);

        this.create();
    }

    create() {
        for (var j = 0; j < 3; j++) {
            this.buffer = createGraphics(this.width, this.height);
            for (var i = 0; i < 10000; i++) {
                let A = createVector(getRandomFromInterval(0, this.width), getRandomFromInterval(0, this.height));
                let theta = fxrand() * 2 * PI;
                let segmentLength = fxrand() * this.lineLength;  // fxrand() * 5 + 2
                let B = createVector(Math.cos(theta) * segmentLength + A.x, Math.sin(theta) * segmentLength + A.y);

                this.buffer.stroke(this.strokeColor);
                this.buffer.strokeWeight(this.strokeSize);
                this.buffer.line(A.x, A.y, B.x, B.y);
            }
            this.buffers.push(this.buffer)
        }
    }



    show() {
        for (var y = 0; y < this.yCount; y++) {
            for (var x = 0; x < this.xCount; x++) {
                var selectedBuffer = getRandomFromList(this.buffers);
                push();
                blendMode(OVERLAY);

                // blendMode(MULTIPLY);
                translate(x * selectedBuffer.width, y * selectedBuffer.height);
                // rotate(getRandomFromList([PI / 2]));
                image(selectedBuffer, 0, 0);
                pop();
            }
        }
    }
}