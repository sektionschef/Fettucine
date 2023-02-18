class Paper {
    constructor() {
        this.width = SHORTSIDE * 0.2; // 800
        this.height = SHORTSIDE * 0.2;  // 800

        // this.strokeColor = distortColorSuperNew(color("#8a8a8a"), 30);
        this.strokeColorBase = color(PALETTE.paper);
        // this.strokeColorBase = color(
        //     red(PALETTE.paper) + 30,
        //     green(PALETTE.paper) + 30,
        //     blue(PALETTE.paper) + 30,
        //     alpha(PALETTE.paper),
        // );
        this.strokeColorOffset = 10;
        this.strokeSize = 1; // 1;
        this.lineLength = 25; // 25; // 5 +2
        this.lineCount = 0.002 * TOTALPIXEL; // 10000

        this.xCount = Math.ceil(width / this.width);
        this.yCount = Math.ceil(height / this.height);

        this.buffer = createGraphics(this.width, this.height);
        this.masterBuffer = createGraphics(width, height);
        this.create();

        this.createMasterBuffer();
    }

    create() {
        for (var i = 0; i < this.lineCount; i++) {
            let A = createVector(getRandomFromInterval(0, this.width), getRandomFromInterval(0, this.height));
            let theta = getRandomFromInterval(0, 2 * PI);
            let segmentLength = getRandomFromInterval(2, this.lineLength);  // fxrand() * 5 + 2
            let B = createVector(Math.cos(theta) * segmentLength + A.x, Math.sin(theta) * segmentLength + A.y);

            this.strokeColor = distortColorSuperNew(this.strokeColorBase, this.strokeColorOffset);

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

            if (B.x < 0) {
                B.x += this.width;
                A.x += this.width;
                this.buffer.line(A.x, A.y, B.x, B.y);
            }

            if (B.y < 0) {
                B.y += this.height;
                A.y += this.height;
                this.buffer.line(A.x, A.y, B.x, B.y);
            }
        }
    }



    createMasterBuffer() {
        for (var y = 0; y < this.yCount; y++) {
            for (var x = 0; x < this.xCount; x++) {
                this.masterBuffer.push();
                // this.masterBuffer.blendMode(OVERLAY);
                this.masterBuffer.translate(x * this.buffer.width, y * this.buffer.height);
                this.masterBuffer.image(this.buffer, 0, 0);
                this.masterBuffer.pop();
            }
        }
    }

    show() {
        push();
        // blendMode(OVERLAY);
        image(this.masterBuffer, 0, 0);
        pop();
    }
}