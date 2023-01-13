class Grid {
    constructor() {
        this.margin = DOMINANTSIDE * 0.1;
        this.boxCount = 9;

        this.opWidth = width - this.margin * 2;
        this.opHeight = height - this.margin * 2;

        if (this.opWidth < this.opHeight) {
            this.subSide = this.opWidth;
        } else {
            this.subSide = this.opHeight;
        }

        this.boxSize = this.subSide / this.boxCount;
        this.boxCountDom = this.subSide / this.boxSize;

    }

    show() {
        push();
        noFill();
        stroke(30);
        strokeWeight(3);
        rect(this.margin, this.margin, this.opWidth, this.opHeight);
        pop();


        for (var i = 0; i < (this.boxCount + 1); i++) {
            strokeWeight(5);
            line(this.margin + i * this.boxSize, 0, this.margin + i * this.boxSize, height);
        }

        for (var i = 0; i < (this.boxCountDom + 1); i++) {
            strokeWeight(5);
            line(0, this.margin + i * this.boxSize, width, this.margin + i * this.boxSize);
        }
    }
}