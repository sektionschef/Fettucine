// setup: noiseStripes = new NoiseStripes(p5.Vector.sub(grid.totalA, createVector(50, 50)), p5.Vector.add(grid.totalC, createVector(50, 50)), grid.stripeOrientation);
// draw: noiseStripes.show();

class NoiseStripes {
    constructor(upperLeft, lowerRight, gridOrientation) {

        this.upperLeft = upperLeft;
        this.lowerRight = lowerRight;
        this.gridOrientation = gridOrientation;

        this.width = this.lowerRight.x - this.upperLeft.x;
        this.height = this.lowerRight.y - this.upperLeft.y;
        this.clusterSize = 4;
        this.lineHeight = SHORTSIDE / 300;
        // console.log("lineHeight: " + this.lineHeight);
        this.xinc = 0.005;
        this.yinc = 0.005;

        this.masterBuffer = createGraphics(this.width, this.height);

        if (this.gridOrientation == "x") {
            this.orientation = "y";
        } else {
            this.orientation = "x";
        }

        this.yoff = 0;
        for (var y = 0; y < this.masterBuffer.height; y += this.clusterSize) {
            this.xoff = 0;
            for (var x = 0; x < this.masterBuffer.width; x += this.clusterSize) {
                this.r = noise(this.xoff, this.yoff);

                if (random() < 0.5) {
                    this.masterBuffer.fill(color(this.r * 255));
                } else {
                    this.masterBuffer.fill(color(random() * 255));
                }

                // RECTS
                this.masterBuffer.noStroke();
                this.masterBuffer.rect(x, y, this.clusterSize, this.clusterSize);

                // POINTS
                // this.masterBuffer.strokeWeight(this.clusterSize / 2);
                // this.masterBuffer.noStroke();
                // this.masterBuffer.noFill();
                // this.masterBuffer.point(x, y);

                this.xoff += this.xinc;
            }
            this.yoff += this.yinc;
        }

        this.createStripes();
    }

    createStripes() {
        this.stripeBuffer = createGraphics(this.width, this.height);

        if (this.orientation == "x") {
            for (var i = 0; i < this.height / (this.clusterSize * this.lineHeight); i++) {
                this.stripeBuffer.fill(random() * 255);
                this.stripeBuffer.noStroke();
                this.stripeBuffer.rect(0, i * this.lineHeight * this.clusterSize, this.width, this.lineHeight * this.clusterSize);

                // lines
                // this.stripeBuffer.stroke(random() * 75 + 75);
                // this.stripeBuffer.strokeWeight(1);
                // this.stripeBuffer.line(0, i * this.lineHeight * this.clusterSize, this.width, i * this.lineHeight * this.clusterSize);
            }
        } else {
            for (var i = 0; i < this.width / (this.clusterSize * this.lineHeight); i++) {
                this.stripeBuffer.fill(random() * 255);
                this.stripeBuffer.noStroke();
                this.stripeBuffer.rect(i * this.lineHeight * this.clusterSize, 0, this.lineHeight * this.clusterSize, this.height);

                // lines
                // this.stripeBuffer.stroke(random() * 75 + 75);
                // this.stripeBuffer.strokeWeight(1);
                // this.stripeBuffer.line(i * this.lineHeight * this.clusterSize, 0, i * this.lineHeight * this.clusterSize, this.height);
            }
        }


        this.masterBuffer.blendMode(OVERLAY);
        this.masterBuffer.image(this.stripeBuffer, 0, 0);
    }

    show() {
        push();
        tint(color(PALETTE.paper));
        image(this.masterBuffer, this.upperLeft.x, this.upperLeft.y);
        pop();
    }
}