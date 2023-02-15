// like a lot: https://editor.p5js.org/AhmadMoussa/sketches/o8Oj_LSty 

class Noise {
    constructor() {

        this.width = SHORTSIDE * 0.15; // 600;
        this.height = SHORTSIDE * 0.15; // 600;
        this.marginX = 0; //50;
        this.marginY = 0; //50;

        this.jCount = 1;  // 1
        this.iCount = 1;  // 6

        this.strokeWeight = 0.00025 * SHORTSIDE;

        this.buffer = createGraphics(this.width, this.height);
        this.masterBuffer = createGraphics(width, height);

        this.xCount = Math.ceil(width / this.buffer.width);
        this.yCount = Math.ceil(height / this.buffer.height);

        this.create();
        this.createMasterBuffer();
    }

    create() {
        // background(255);
        // this.buffer.fill(255, 127.5, 50);
        // this.buffer.noStroke();
        //rect(100,100,200)

        this.buffer.stroke(color("black"));
        for (var j = 0; j < this.jCount; j++) {
            for (var i = 0; i < this.iCount; i++) {
                for (var x = 0; x < (this.buffer.width - this.marginX * 2); x++) {
                    for (var y = 0; y < this.buffer.height - this.marginY * 2; y++) {
                        var n = noise(x * 0.02, y * 0.02);
                        if (random(1) > 0.9 - 0.01 * i - n / 5) {
                            // if (random(1) > 0.9) {
                            this.buffer.strokeWeight(
                                // random(
                                //     0.2 + y / 500 - n / 10,
                                //     0.3 + y / 100 - n / 10 - j / 5
                                // )
                                this.strokeWeight
                            );

                            // let A = createVector(this.marginX + x + random(-2, 2), this.marginY + y + random(-3, 3))
                            let A = createVector(this.marginX + x, this.marginY + y);

                            // this.buffer.point(this.marginX + x + (j) * (this.buffer.width - this.marginY * 2) / 5 + random(-2, 2), this.marginY + y + random(-3, 3));
                            this.buffer.point(A.x, A.y);

                            // SEAMLESS PATTERN
                            if (A.x > (this.buffer.width - this.strokeWeight)) {
                                A.x -= (this.buffer.width - this.strokeWeight);
                                this.buffer.point(A.x, A.y);
                            }

                            if (A.y > (this.buffer.height - this.strokeWeight)) {
                                A.y -= (this.buffer.height - this.strokeWeight);
                                this.buffer.point(A.x, A.y);
                            }
                        }
                    }
                }
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
        blendMode(OVERLAY);
        image(this.masterBuffer, 0, 0);
        pop();
    }
}