class Noise {
    constructor() {

        this.buffer = createGraphics(400, 400);
        this.xoff = 50;
        this.yoff = 50;

        this.create();
    }

    create() {
        // background(255);
        this.buffer.fill(255, 127.5, 50);
        this.buffer.noStroke();
        //rect(100,100,200)

        this.buffer.strokeWeight(1);
        for (var j = 0; j < 1; j++) {
            for (var i = 0; i < 6; i++) {
                this.buffer.stroke(0);
                for (var x = 1; x < (this.buffer.width - this.yoff * 2); x++) {
                    for (var y = 0; y < this.buffer.height - this.yoff * 2; y++) {
                        var n = noise(x * 0.02, y * 0.02);
                        if (random(1) > 0.9 - 0.01 * i - n / 5) {
                            this.buffer.strokeWeight(
                                random(
                                    0.2 + y / 500 - n / 10,
                                    0.3 + y / 100 - n / 10 - j / 5
                                )
                            );

                            this.buffer.point(this.xoff + x + (j) * (this.buffer.width - this.yoff * 2) / 5 + random(-2, 2), this.yoff + y + random(-3, 3));
                        }
                    }
                }
            }
        }
    }

    show() {
        image(this.buffer, 300, 300);
    }
}