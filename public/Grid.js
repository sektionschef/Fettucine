class Grid {
    constructor() {
        // this.margin = 0; // DOMINANTSIDE * 0.1;
        this.profile = "1/3-1/6";
        this.bezierOffset = 40;

        this.opWidth = width //- this.margin * 2;
        this.opHeight = height //- this.margin * 2;

        if (this.opWidth < this.opHeight) {
            this.subSide = this.opWidth;
            this.domSide = this.opHeight;
        } else {
            this.subSide = this.opHeight;
            this.domSide = this.opWidth;
        }

        this.actives = {};
        this.columns = new Set();
        this.rows = new Set();

        this.buffer = createGraphics(width, height);

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

                var ABStop1 = createVector(B.x + (A.x - B.x) / 4, B.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var ABStop2 = createVector(B.x + (A.x - B.x) / 4 * 3, B.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var BCStop1 = createVector(C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), C.y + (B.y - C.y) / 4);
                var BCStop2 = createVector(C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), C.y + (B.y - C.y) / 4 * 3);
                var CDStop1 = createVector(D.x + (C.x - D.x) / 4 * 3, D.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var CDStop2 = createVector(D.x + (C.x - D.x) / 4, D.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var DAStop1 = createVector(A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), A.y + (D.y - A.y) / 4 * 3);
                var DAStop2 = createVector(A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), A.y + (D.y - A.y) / 4);

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
                    "ABStop1": ABStop1,
                    "ABStop2": ABStop2,
                    "BCStop1": BCStop1,
                    "BCStop2": BCStop2,
                    "CDStop1": CDStop1,
                    "CDStop2": CDStop2,
                    "DAStop1": DAStop1,
                    "DAStop2": DAStop2,
                    "dominant": d,
                    "sub": s,
                    "index": index,
                    "mask": false,
                })

                index += 1;
            }
        }

        this.createMask();
        this.drawMask();
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

    createMask() {

        this.showDebug()

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
                    // noStroke();
                    // fill("white");
                    // rect(box.A.x, box.A.y, this.boxSize, this.boxSize);

                    box.mask = true;
                    this.columns.add(box.sub);
                    this.rows.add(box.dominant);
                }
                // }
                // }
            }
        }

        this.selectColumnMasks();
    }

    createNoise(start, stop1, stop2, end) {
        this.pointCount = 600;
        this.noiseWeight = 2;
        this.noiseColor = color("black");

        var stats1 = getSteep(start, stop1);
        var stats2 = getSteep(stop1, stop2);
        var stats3 = getSteep(stop2, end);
        // var stats4 = getSteep(this.A3, this.B);


        for (var i = 0; i < this.pointCount; i++) {

            let x = getRandomFromInterval(start.x, end.x);

            // ATTENTION HARD CODED VALUE - y axis
            // let offset = randomGaussian(0, (this.A.y - this.D.y) / 4);
            let offset = randomGaussian(0, 100);
            // let y = height / 10 * 2 + abs(offset);
            if (x < start.x) {
                this.baseY = start.y;
            } else if (x > start.x & x < stop1.x) {
                this.baseY = stats1[0] * x + stats1[1]
            } else if (x > stop1.x & x < stop2.x) {
                this.baseY = stats2[0] * x + stats2[1]
            } else {
                this.baseY = stats3[0] * x + stats3[1]
            }
            let y = this.baseY + abs(offset);

            this.buffer.push()
            this.buffer.stroke(this.noiseColor);
            this.buffer.strokeWeight(this.noiseWeight);
            this.buffer.point(x, y);
            this.buffer.pop();
        }
    }

    createUpperLine() {
        this.buffer.push();
        this.buffer.stroke(color("#3a3a3a"));
        this.buffer.strokeWeight(2);
        this.buffer.noFill();

        // this.buffer.line(start.x, start.y, end.x, end.y);

        this.buffer.beginShape();
        this.buffer.vertex(this.A.x, this.A.y);
        this.buffer.bezierVertex(
            this.ABStop1.x,
            this.ABStop1.y,
            this.ABStop2.x,
            this.ABStop2.y,
            this.B.x,
            this.B.y
        );
        this.buffer.endShape();

        this.buffer.pop();
    }

    createLowerLine() {
        this.buffer.push();
        this.buffer.stroke(color("#c2c2c2"));
        this.buffer.strokeWeight(6);
        this.buffer.noFill();

        this.buffer.beginShape();
        this.buffer.vertex(this.C.x, this.C.y);
        this.buffer.bezierVertex(
            this.CDStop1.x,
            this.CDStop1.y,
            this.CDStop2.x,
            this.CDStop2.y,
            this.D.x,
            this.D.y
        );
        this.buffer.endShape();

        this.buffer.pop();
    }


    selectColumnMasks() {
        // columns
        // for (var box of this.boxes) {
        //     if (box.mask) {
        //         if (box.sub == 34) { // one Column
        //             this.actives.push(box);
        //         }
        //     }
        // }
        // console.log(this.actives);
        // console.log(this.columns);
        // console.log(this.rows);

        for (var column of this.columns) {
            // console.log(column);
            this.actives[column] = [];
            for (var box of this.boxes) {
                if (box.mask && box.sub == column) {
                    this.actives[column].push(box);
                }
            }
        }
    }

    drawMask() {

        this.buffer.push();
        // translate(0, 0);
        // this.buffer.fill("blue");
        this.buffer.fill(color(BACKGROUND));
        this.buffer.noStroke();

        this.buffer.beginShape();
        // clockwise
        this.buffer.vertex(0, 0);
        this.buffer.vertex(width, 0);
        this.buffer.vertex(width, height);
        this.buffer.vertex(0, height);

        for (var column in this.actives) {
            // console.log(column);
            this.A = this.actives[column][0].A;
            this.B = this.actives[column][0].B;
            this.C = this.actives[column][this.actives[column].length - 1].C;
            this.D = this.actives[column][this.actives[column].length - 1].D;

            this.ABStop1 = this.actives[column][0].ABStop1;
            this.ABStop2 = this.actives[column][0].ABStop2;
            this.BCStop1 = createVector(this.C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.C.y + (this.B.y - this.C.y) / 4);
            this.BCStop2 = createVector(this.C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.C.y + (this.B.y - this.C.y) / 4 * 3);
            this.CDStop1 = this.actives[column][this.actives[column].length - 1].CDStop1;
            this.CDStop2 = this.actives[column][this.actives[column].length - 1].CDStop2;
            this.DAStop2 = createVector(this.A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.A.y + (this.D.y - this.A.y) / 4);
            this.DAStop1 = createVector(this.A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.A.y + (this.D.y - this.A.y) / 4 * 3);

            this.createMaskElement();
        }

        this.buffer.endShape(CLOSE);
        this.buffer.pop();

        // extra loop outside of beginShape and endShape
        for (var column in this.actives) {
            // console.log(column);
            this.A = this.actives[column][0].A;
            this.B = this.actives[column][0].B;
            this.C = this.actives[column][this.actives[column].length - 1].C;
            this.D = this.actives[column][this.actives[column].length - 1].D;

            this.ABStop1 = this.actives[column][0].ABStop1;
            this.ABStop2 = this.actives[column][0].ABStop2;
            this.CDStop1 = this.actives[column][this.actives[column].length - 1].CDStop1;
            this.CDStop2 = this.actives[column][this.actives[column].length - 1].CDStop2;

            this.createUpperLine();
            this.createLowerLine();
        }
    }

    createMaskElement() {

        // counter-clockwise
        this.buffer.beginContour();

        // counter-clockwise
        this.buffer.vertex(this.A.x, this.A.y);
        this.buffer.bezierVertex(
            this.DAStop2.x,
            this.DAStop2.y,
            this.DAStop1.x,
            this.DAStop1.y,
            this.D.x,
            this.D.y
        );

        this.buffer.bezierVertex(
            this.CDStop2.x,
            this.CDStop2.y,
            this.CDStop1.x,
            this.CDStop1.y,
            this.C.x,
            this.C.y
        );

        this.buffer.bezierVertex(
            this.BCStop2.x,
            this.BCStop2.y,
            this.BCStop1.x,
            this.BCStop1.y,
            this.B.x,
            this.B.y
        );

        // A2-A1
        this.buffer.bezierVertex(
            this.ABStop2.x,
            this.ABStop2.y,
            this.ABStop1.x,
            this.ABStop1.y,
            this.A.x,
            this.A.y
        );
        this.buffer.endContour();

        this.createNoise(this.A, this.ABStop1, this.ABStop2, this.B);
    }

    show() {
        push();
        image(this.buffer, 0, 0);
        pop();
    }
}