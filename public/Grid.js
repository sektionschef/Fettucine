class Grid {
    constructor() {
        // this.margin = 0; // DOMINANTSIDE * 0.1;
        this.profile = "1/3-1/6";


        this.opWidth = width //- this.margin * 2;
        this.opHeight = height //- this.margin * 2;

        if (this.opWidth < this.opHeight) {
            this.subSide = this.opWidth;
            this.domSide = this.opHeight;
        } else {
            this.subSide = this.opHeight;
            this.domSide = this.opWidth;
        }

        // only the rest
        // TODO center for this.margin/2;
        // console.log(this.subSide % 50 == 0);
        this.margin = this.subSide % 50;
        // console.log("margin: " + this.margin);

        this.boxCount = this.subSide / 50;
        // console.log("boxcount: " + this.boxCount);

        this.boxSize = this.subSide / this.boxCount;
        this.boxCountDom = this.domSide / this.boxSize;

        this.boxes = [];
        var index = 0;

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
                    "sub": s,
                    "index": index,
                })

                index += 1;
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
        for (var i = 0; i < (this.boxCount + 1); i++) {
            strokeWeight(10);
            line(this.margin + i * this.boxSize, 0, this.margin + i * this.boxSize, height);
        }

        for (var i = 0; i < (this.boxCountDom + 1); i++) {
            strokeWeight(10);
            line(0, this.margin + i * this.boxSize, width, this.margin + i * this.boxSize);
        }
    }

    show() {

        // this.showDebug()

        // old thing
        // this.third = Math.round(this.boxCount / 3);
        // console.log("third: " + this.third)
        // this.stripe = Math.round(this.third / 8);

        this.stripe = Math.round(this.boxCount * 0.01);
        // console.log(this.stripe);

        for (var box of this.boxes) {
            // if (box.dominant == 4) {
            //     noStroke();
            //     // strokeWeight(3);
            //     fill("white");
            //     rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            // }

            // if (box.sub == 1) {
            //     noStroke();
            //     // strokeWeight(3);
            //     fill("white");
            //     rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            // }

            // old thing
            // if (box.dominant > 10 && box.dominant < (this.boxCountDom - 10)) {
            //     for (var i = 0; i < 8; i += 2) {
            //         if (box.sub >= (this.third + this.stripe * i) && box.sub < (this.third + this.stripe * (i + 1)) && (box.sub < this.third * 2)) {
            //             noStroke();
            //             // strokeWeight(3);
            //             fill("white");
            //             rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            //         }
            //     }
            // }

            // margin
            if (
                box.dominant > this.boxCountDom / 10 &&
                box.dominant < this.boxCountDom / 10 * 9 &&
                box.sub > (this.boxCount / 5 * 2) &&
                box.sub < (this.boxCount / 5 * 3)
            ) {
                // for (var i = 0; i < this.boxCount; i += 2) {
                // if (box.sub >= this.stripe * i && box.sub < this.stripe * (i + 1)) {
                if (box.index % 2 == 0) { // 2,3,4
                    noStroke();
                    // strokeWeight(3);
                    fill("white");
                    rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
                }
                // }
                // }
            }
        }
    }
}