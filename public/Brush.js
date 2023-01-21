class Brush {
    constructor(data) {
        // var set = fxrand();
        // if (set > 0.9) { var colors = color(100) } else if (set > 0.3) { var colors = color(randomGaussian(220, 20)) } else { var colors = color(230) };//[color("#6d6d6d"), color("#9c9c9c"), color("#e9e9e9")];
        this.size = data.size;
        this.strokeSize = data.strokeSize;
        this.fillColor = data.fillColor;
        // this.fillColor = colors; //getRandomFromList(colors);
        this.strokeColor = data.strokeColor;
        // this.strokeColor = color("black");//color(randomGaussian(30, 10));
        this.curveSexyness = data.curveSexyness;
        // this.curveSexyness = getRandomFromInterval(1, 5);

        this.pixelDistort = 30;

        this.buffer = createGraphics(this.size, this.size);

        let q1X = getRandomFromInterval(0, this.buffer.width / 2);
        let q1Y = getRandomFromInterval(0, this.buffer.height / 2);
        let q2X = getRandomFromInterval(this.buffer.width / 2, this.buffer.width);
        let q2Y = getRandomFromInterval(0, this.buffer.height / 2);
        let q3X = getRandomFromInterval(0, this.buffer.width / 2);
        let q3Y = getRandomFromInterval(this.buffer.height / 2, this.buffer.height);
        let q4X = getRandomFromInterval(this.buffer.width / 2, this.buffer.width);
        let q4Y = getRandomFromInterval(this.buffer.height / 2, this.buffer.height);

        // this.buffer.noStroke();
        // this.buffer.fill(color(PALETTE.pixelColors[2]));
        // this.buffer.stroke(color(PALETTE.pixelColors[1]));
        // this.buffer.strokeWeight(3);
        // this.buffer.beginShape();
        // this.buffer.vertex(10, 10);
        // this.buffer.vertex(90, 10);
        // this.buffer.vertex(60, 60);
        // this.buffer.vertex(10, 40);
        // this.buffer.endShape(CLOSE);

        // CURVES
        this.buffer.push();
        this.buffer.curveTightness(this.curveSexyness);
        this.buffer.fill(this.fillColor);
        this.buffer.stroke(this.strokeColor);
        this.buffer.strokeWeight(this.strokeSize);
        this.buffer.beginShape();
        this.buffer.curveVertex(q1X, q1Y);
        this.buffer.curveVertex(q1X, q1Y);
        this.buffer.curveVertex(q2X, q2Y);
        this.buffer.curveVertex(q4X, q4Y);
        this.buffer.curveVertex(q3X, q3Y);
        this.buffer.curveVertex(q3X, q3Y);
        this.buffer.endShape(CLOSE);
        this.buffer.pop();

        // LINES
        // this.buffer.fill(this.fillColor);
        // this.buffer.stroke(this.strokeColor);
        // this.buffer.strokeWeight(this.strokeSize);
        // this.buffer.beginShape();
        // this.buffer.vertex(q1X, q1Y);
        // this.buffer.vertex(q1X, q1Y);
        // this.buffer.vertex(q2X, q2Y);
        // this.buffer.vertex(q4X, q4Y);
        // this.buffer.vertex(q3X, q3Y);
        // this.buffer.vertex(q3X, q3Y);
        // this.buffer.endShape(CLOSE);

        // this.createNoise();

        this.buffer.loadPixels();
        var x, y, index;
        for (x = 0; x < this.buffer.width; x++) {
            for (y = 0; y < this.buffer.height; y++) {
                index = (x + y * this.buffer.width) * 4;


                // var offset = getRandomFromInterval(-this.pixelDistort, this.pixelDistort)

                // if (this.buffer.pixels[index + 3] != 0) {
                //     this.buffer.pixels[index + 0] += offset;
                //     this.buffer.pixels[index + 1] += offset;
                //     this.buffer.pixels[index + 2] += offset;
                //     this.buffer.pixels[index + 3] = this.buffer.pixels[index + 3];
                // }


                // GRADIENT
                // let inter = map(x, 0, this.buffer.width, 0, 1);
                // let c = lerpColor(color("#353535"), color("#dddddd"), inter);

                // if (this.buffer.pixels[index + 3] != 0) {
                //     this.buffer.pixels[index + 0] = red(c);
                //     this.buffer.pixels[index + 1] = green(c);
                //     this.buffer.pixels[index + 2] = blue(c);
                //     this.buffer.pixels[index + 3] = this.buffer.pixels[index + 3];
                // }

                var offset = getRandomFromInterval(-this.pixelDistort, this.pixelDistort)
                var threshold = map(x, 0, this.buffer.width, 0, 1);

                if (fxrand() > threshold) {
                    this.buffer.pixels[index + 0] += offset;
                    this.buffer.pixels[index + 1] += offset;
                    this.buffer.pixels[index + 2] += offset;
                    this.buffer.pixels[index + 3] = this.buffer.pixels[index + 3];
                } else {
                    this.buffer.pixels[index + 0] = 0;
                    this.buffer.pixels[index + 1] = 0;
                    this.buffer.pixels[index + 2] = 0;
                    this.buffer.pixels[index + 3] = this.buffer.pixels[index + 3];
                }

            }
        }
        this.buffer.updatePixels();
    }


    createNoise() {
        this.pointCount = 40 * this.buffer.width;
        this.noiseDistance = this.buffer.width / 3;
        this.noiseWeight = 1;
        this.noiseColor = color("#3a3a3a");

        for (var i = 0; i < this.pointCount; i++) {

            let y = getRandomFromInterval(0, this.buffer.height);

            let offset = randomGaussian(0, this.noiseDistance);
            let x = abs(offset);

            this.buffer.push()
            this.buffer.stroke(this.noiseColor);
            this.buffer.strokeWeight(this.noiseWeight);
            this.buffer.point(x, y);
            this.buffer.pop();
        }
    }
}