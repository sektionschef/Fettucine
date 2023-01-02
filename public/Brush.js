class Brush {
    constructor() {
        this.size = 100
        this.buffer = createGraphics(this.size, this.size);

        // this.buffer.noStroke();
        this.buffer.fill(color(PALETTE.pixelColors[2]));
        this.buffer.stroke(color(PALETTE.pixelColors[1]));
        this.buffer.strokeWeight(3);
        this.buffer.beginShape();
        this.buffer.vertex(10, 10);
        this.buffer.vertex(90, 10);
        this.buffer.vertex(60, 60);
        this.buffer.vertex(10, 40);
        this.buffer.endShape();
    }
}