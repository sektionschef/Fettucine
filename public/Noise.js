// https://editor.p5js.org/AhmadMoussa/sketches/o8Oj_LSty 

class Noise {
    constructor() {

        this.width = 500;
        this.height = 500;
        this.marginX = 0; //50;
        this.marginY = 0; //50;

        this.jCount = 1;  // 1
        this.iCount = 1;  // 6


        this.buffer = createGraphics(this.width, this.height);
        this.create();
    }

    create() {
        // background(255);
        this.buffer.fill(255, 127.5, 50);
        this.buffer.noStroke();
        //rect(100,100,200)

        this.buffer.strokeWeight(1);
        for (var j = 0; j < this.jCount; j++) {
            for (var i = 0; i < this.iCount; i++) {
                this.buffer.stroke(0);
                for (var x = 1; x < (this.buffer.width - this.marginX * 2); x++) {
                    for (var y = 0; y < this.buffer.height - this.marginY * 2; y++) {
                        var n = noise(x * 0.02, y * 0.02);
                        if (random(1) > 0.9 - 0.01 * i - n / 5) {
                            // if (random(1) > 0.9) {
                            this.buffer.strokeWeight(
                                // random(
                                //     0.2 + y / 500 - n / 10,
                                //     0.3 + y / 100 - n / 10 - j / 5
                                // )
                                1
                            );

                            // this.buffer.point(this.marginX + x + (j) * (this.buffer.width - this.marginY * 2) / 5 + random(-2, 2), this.marginY + y + random(-3, 3));
                            this.buffer.point(this.marginX + x + random(-2, 2), this.marginY + y + random(-3, 3));
                        }
                    }
                }
            }
        }
    }

    show() {
        // image(this.buffer, 0, 0);

        var xCount = Math.ceil(width / this.buffer.width);
        var yCount = Math.ceil(height / this.buffer.height);

        for (var y = 0; y < yCount; y++) {
            for (var x = 0; x < xCount; x++) {
                blendMode(OVERLAY);
                // blendMode(MULTIPLY);
                image(this.buffer, x * this.buffer.width, y * this.buffer.height);
                blendMode(NORMAL);
            }
        }


    }
}