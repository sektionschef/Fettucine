class Overlay {
    constructor() {

        this.overlayColor = color(PALETTE.background[1]);
        this.curveSexyness = 1.07;
        this.buffer = createGraphics(width, height);

        this.buffer.fill(this.overlayColor)
        this.buffer.noStroke();
        this.buffer.curveTightness(this.curveSexyness);

        // top
        this.buffer.beginShape();
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 4, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width, 0);
        this.buffer.endShape();

        // left
        this.buffer.beginShape();
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 4);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height);
        this.buffer.endShape();

        // bottom
        this.buffer.beginShape();
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        this.buffer.curveVertex(width, height);
        this.buffer.curveVertex(width, height);
        this.buffer.endShape();

        // right
        this.buffer.beginShape();
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 4);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        this.buffer.curveVertex(width, height);
        this.buffer.curveVertex(width, height);
        this.buffer.endShape();
    }
}