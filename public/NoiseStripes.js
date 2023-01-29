class NoiseStripes {
    constructor() {

        this.width = width;
        this.height = height;
        // this.orientation = "x";
        this.orientation = "y";
        this.clusterSize = 2;
        this.lineHeight = SHORTSIDE / 300;
        // console.log("lineHeight: " + this.lineHeight);
        this.xinc = 0.005;
        this.yinc = 0.005;

        this.masterBuffer = createGraphics(this.width, this.height);

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

                this.masterBuffer.noStroke();
                this.masterBuffer.rect(x, y, this.clusterSize, this.clusterSize);
                this.xoff += this.xinc;
            }
            this.yoff += this.yinc;
        }

        this.stripeBuffer = createGraphics(this.width, this.height);

        if (this.orientation == "x") {
            for (var i = 0; i < this.height / (this.clusterSize * this.lineHeight); i++) {
                this.stripeBuffer.fill(random() * 100 + 150);
                this.stripeBuffer.noStroke();
                this.stripeBuffer.rect(0, i * this.lineHeight * this.clusterSize, this.width, this.lineHeight * this.clusterSize);
            }
        } else {
            for (var i = 0; i < this.width / (this.clusterSize * this.lineHeight); i++) {
                this.stripeBuffer.fill(random() * 100 + 150);
                this.stripeBuffer.noStroke();
                this.stripeBuffer.rect(i * this.lineHeight * this.clusterSize, 0, this.lineHeight * this.clusterSize, this.height);
            }
        }


        this.masterBuffer.blendMode(OVERLAY);
        this.masterBuffer.image(this.stripeBuffer, 0, 0);
    }

    show() {
        push();
        image(this.masterBuffer, 0, 0);
        pop();
    }
}