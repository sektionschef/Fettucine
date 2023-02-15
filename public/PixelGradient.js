class PixelGradient {
    constructor() {
        this.A = createVector(0, 0);
        this.B = createVector(width, 0);
        this.C = createVector(width, height);
        this.D = createVector(0, height);

        this.center = createVector(width / 2, height / 2);

        // this.strokeColor = color("#a8a8a8");
        this.strokeColor = color(
            red(PALETTE.paper) - 60,
            green(PALETTE.paper) - 60,
            blue(PALETTE.paper) - 60,
            alpha(PALETTE.paper),
        );
        this.strokeWeight = 1;
        this.pointCount = TOTALPIXEL * 0.005;

        this.buffer = createGraphics(width, height);
        this.masterBuffer = createGraphics(width, height);
        this.create();
        this.createMasterBuffer();
    }

    create() {
        // debug
        // this.buffer.fill(color("#555555"));
        // this.buffer.rect(0, height / 6 * 2, width, height / 6 * 2);
        // this.buffer.stroke()

        for (var i = 0; i < this.pointCount; i++) {

            let x = randomGaussian(this.buffer.width / 2, SHORTSIDE / 6);
            let y = randomGaussian(this.buffer.height / 2, SHORTSIDE / 6);

            this.buffer.push()
            this.buffer.stroke(this.strokeColor);
            this.buffer.strokeWeight(this.strokeWeight);
            this.buffer.point(x, y);
            this.buffer.pop();
        }
    }

    createMasterBuffer() {
        // move the same buffer it to the 4 edges
        this.masterBuffer.push();
        this.masterBuffer.blendMode(OVERLAY);
        this.masterBuffer.image(this.buffer, -this.buffer.width / 2, -this.buffer.height / 2);
        this.masterBuffer.image(this.buffer, this.buffer.width - this.buffer.width / 2, -this.buffer.height / 2);
        this.masterBuffer.image(this.buffer, this.buffer.width - this.buffer.width / 2, this.buffer.height - this.buffer.height / 2);
        this.masterBuffer.image(this.buffer, -this.buffer.width / 2, this.buffer.height - this.buffer.height / 2);
        this.masterBuffer.pop();
    }

    show() {
        push();
        // blendMode(OVERLAY);
        image(this.masterBuffer, 0, 0);
        pop();
    }
}