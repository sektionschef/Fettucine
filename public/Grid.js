class Grid {
    constructor() {
        this.margin = DOMINANTSIDE * 0.1;
        this.boxCount = 9;

        this.opWidth = width - this.margin * 2;
        this.opHeight = height - this.margin * 2;

        if (this.opWidth < this.opHeight) {
            this.subSide = this.opWidth;
            this.domSide = this.opHeight;
        } else {
            this.subSide = this.opHeight;
            this.domSide = this.opWidth;
        }

        this.boxSize = this.subSide / this.boxCount;
        this.boxCountDom = this.domSide / this.boxSize;

        this.boxes = [];

        for (var d = 0; d < (this.boxCountDom); d++) {
            for (var s = 0; s < (this.boxCount); s++) {
                // line(this.margin + i * this.boxSize, 0, this.margin + i * this.boxSize, height);
                var A = createVector(this.margin + s * this.boxSize, this.margin + d * this.boxSize);
                var B = p5.Vector.add(A, createVector(this.boxSize, 0));
                var C = p5.Vector.add(A, createVector(this.boxSize, this.boxSize));
                var D = p5.Vector.add(A, createVector(0, this.boxSize));

                // DEBUG
                // strokeWeight(20);
                // point(A.x, A.y);
                // point(B.x, B.y);
                // point(C.x, C.y);
                // point(D.x, D.y);

                this.boxes.push({
                    "A": A,
                    "B": B,
                    "C": C,
                    "D": D,
                    "dominant": d,
                    "sub": s
                })
            }
        }
    }

    showDebug() {
        // view margin
        // push();
        // noFill();
        // stroke(30);
        // strokeWeight(3);
        // rect(this.margin, this.margin, this.opWidth, this.opHeight);
        // pop();


        // view cols and rows
        // for (var i = 0; i < (this.boxCount + 1); i++) {
        //     strokeWeight(10);
        //     line(this.margin + i * this.boxSize, 0, this.margin + i * this.boxSize, height);
        // }

        // for (var i = 0; i < (this.boxCountDom + 1); i++) {
        //     strokeWeight(10);
        //     line(0, this.margin + i * this.boxSize, width, this.margin + i * this.boxSize);
        // }
    }
    show() {

        // this.showDebug();

        for (var box of this.boxes) {
            if (box.dominant == 4) {
                noStroke();
                // strokeWeight(3);
                fill("white");
                rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            }

            if (box.sub == 1) {
                noStroke();
                // strokeWeight(3);
                fill("white");
                rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            }
        }

    }
}