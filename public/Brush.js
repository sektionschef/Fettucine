class Brush {
    constructor(data) {
        this.size = data.size;
        this.strokeSize = data.strokeSize;
        this.fillColor = data.fillColor;
        this.strokeColor = data.strokeColor;

        this.pixelDistort = 20;

        this.buffer = createGraphics(this.size, this.size);

        this.curveSexyness = 1;


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

        // this.buffer.loadPixels();
        // var x, y, index;
        // for (x = 0; x < width; x++) {
        //     for (y = 0; y < height; y++) {
        //         index = (x + y * width) * 4;

        //         if (this.buffer.pixels[index + 3] != 0) {
        //             this.buffer.pixels[index + 0] += getRandomFromInterval(-this.pixelDistort, this.pixelDistort);
        //             this.buffer.pixels[index + 1] += getRandomFromInterval(-this.pixelDistort, this.pixelDistort);
        //             this.buffer.pixels[index + 2] += getRandomFromInterval(-this.pixelDistort, this.pixelDistort);
        //             this.buffer.pixels[index + 3] = 255;
        //         }

        //     }
        // }
        // this.buffer.updatePixels();
    }
}