class Corny {
    constructor() {
        this.width = SHORTSIDE * 0.25; // 800
        this.height = SHORTSIDE * 0.25;  // 800

        this.dotcCount = 0.0005 * TOTALPIXEL;
        this.diameter = 2;
        this.colorBase = color(
            red(PALETTE.paper) - 20,
            green(PALETTE.paper) - 20,
            blue(PALETTE.paper) - 20,
            alpha(PALETTE.paper),
        );
        this.colorDistort = 10;

        this.xCount = Math.ceil(width / this.width);
        this.yCount = Math.ceil(height / this.height);

        this.buffer = createGraphics(this.width, this.height);
        this.masterBuffer = createGraphics(width, height);
        this.create();

        this.createMasterBuffer();
    }

    create() {
        for (var i = 0; i < this.dotcCount; i++) {

            this.fillColor = distortColorSuperNew(this.colorBase, this.colorDistort);
            this.pos = createVector(getRandomFromInterval(0, this.width), getRandomFromInterval(0, this.height));

            this.buffer.noStroke();
            this.buffer.ellipseMode(CENTER);
            this.buffer.fill(this.fillColor);

            this.buffer.circle(this.pos.x, this.pos.y, this.diameter);

            // repeat for seamless pattern
            if ((this.pos.x + this.diameter) >= this.width) {
                this.pos.x -= this.width;
                this.buffer.circle(this.pos.x, this.pos.y, this.diameter);
            }
            if ((this.pos.x - this.diameter) <= 0) {
                this.pos.x += this.width;
                this.buffer.circle(this.pos.x, this.pos.y, this.diameter);
            }

            if ((this.pos.y + this.diameter) >= this.height) {
                this.pos.y -= this.height;
                this.buffer.circle(this.pos.x, this.pos.y, this.diameter);
            }
            if ((this.pos.y - this.diameter) <= 0) {
                this.pos.y += this.height;
                this.buffer.circle(this.pos.x, this.pos.y, this.diameter);
            }


            //  DEBUG
            // this.buffer.push();
            // this.buffer.stroke(1);
            // this.buffer.strokeWeight(0.5);
            // this.buffer.noFill();
            // this.buffer.rect(0, 0, this.width, this.height);
            // this.buffer.pop();
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