class Overlay {
    constructor(colorObject) {
        this.DEBUG = false;

        this.overlayColor = color(colorObject);
        this.curveSexyness = 1.2;
        this.buffer = createGraphics(width, height);

        if (this.DEBUG) {
            stroke(30);
            noFill();
        } else {
            this.buffer.noStroke();
            this.buffer.fill(this.overlayColor)
        }

        this.buffer.curveTightness(this.curveSexyness);

        // top
        this.buffer.beginShape();
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, height / 8 * 3);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 4, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        this.buffer.curveVertex(width, height / 8 * 3);
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width, 0);
        this.buffer.endShape();

        // left
        this.buffer.beginShape();
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(0, 0);
        this.buffer.curveVertex(width / 8 * 4, 0);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 4);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height);
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height);
        this.buffer.endShape();

        // bottom
        this.buffer.beginShape();
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height);
        this.buffer.curveVertex(0, height / 8 * 6);
        this.buffer.curveVertex(width / 8 * 3, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        this.buffer.curveVertex(width, height / 8 * 6);
        this.buffer.curveVertex(width, height);
        this.buffer.curveVertex(width, height);
        this.buffer.endShape();

        // right
        this.buffer.beginShape();
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width, 0);
        this.buffer.curveVertex(width / 8 * 4, 0);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 1);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 4);
        this.buffer.curveVertex(width / 8 * 5, height / 8 * 7);
        this.buffer.curveVertex(width / 8 * 4, height);
        this.buffer.curveVertex(width, height);
        this.buffer.curveVertex(width, height);
        this.buffer.endShape();
    }
}