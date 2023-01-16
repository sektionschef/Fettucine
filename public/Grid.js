class Grid {
    constructor() {
        this.profile = "1/3-1/6";
        this.boxSize = 50;
        this.bezierOffset = 40;

        this.opWidth = width;
        this.opHeight = height;

        if (this.opWidth < this.opHeight) {
            this.shortSide = this.opWidth;
            this.longSide = this.opHeight;
        } else {
            this.shortSide = this.opHeight;
            this.longSide = this.opWidth;
        }

        // only the rest
        // TODO center for this.margin/2;
        // console.log(this.shortSide % 50 == 0);
        this.margin = this.shortSide % this.boxSize;
        // console.log("margin: " + this.margin);

        this.shortBoxCount = this.shortSide / this.boxSize;
        this.longBoxCount = this.longSide / this.boxSize;
        // console.log("shortBoxCount: " + this.shortBoxCount);

        this.actives = {};
        this.columns = new Set();
        this.rows = new Set();
        this.boxes = [];

        this.buffer = createGraphics(width, height);


        this.createBoxes();
        this.createMask();
        this.drawMask();
    }

    createBoxes() {
        var index = 0;

        for (var l = 0; l < (this.longBoxCount); l++) {
            for (var s = 0; s < (this.shortBoxCount); s++) {

                // corners of the box
                var A = createVector(this.margin + s * this.boxSize, this.margin + l * this.boxSize);
                var B = p5.Vector.add(A, createVector(this.boxSize, 0));
                var C = p5.Vector.add(A, createVector(this.boxSize, this.boxSize));
                var D = p5.Vector.add(A, createVector(0, this.boxSize));

                // stops between corners
                var ABStop1 = createVector(B.x + (A.x - B.x) / 4, B.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var ABStop2 = createVector(B.x + (A.x - B.x) / 4 * 3, B.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var BCStop1 = createVector(C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), C.y + (B.y - C.y) / 4);
                var BCStop2 = createVector(C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), C.y + (B.y - C.y) / 4 * 3);
                var CDStop1 = createVector(D.x + (C.x - D.x) / 4 * 3, D.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var CDStop2 = createVector(D.x + (C.x - D.x) / 4, D.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset));
                var DAStop1 = createVector(A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), A.y + (D.y - A.y) / 4 * 3);
                var DAStop2 = createVector(A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), A.y + (D.y - A.y) / 4);

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
                    "long": l,
                    "short": s,
                    "index": index,
                    "mask": false,
                })
                index += 1;
            }
        }
    }

    showDebug() {

        // view cols and rows
        for (var i = 0; i < (this.shortBoxCount + 1); i++) {
            strokeWeight(10);
            line(this.margin + i * this.boxSize, 0, this.margin + i * this.boxSize, height);
        }

        for (var i = 0; i < (this.longBoxCount + 1); i++) {
            strokeWeight(10);
            line(0, this.margin + i * this.boxSize, width, this.margin + i * this.boxSize);
        }
    }

    // select active boxes
    createMask() {

        // this.showDebug()

        // this.stripe = Math.round(this.shortBoxCount * 0.01);
        // console.log(this.stripe);

        for (var box of this.boxes) {
            // if (box.long == 4) {
            //     noStroke();
            //     // strokeWeight(3);
            //     fill("white");
            //     rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            // }

            // if (box.short == 1) {
            //     noStroke();
            //     // strokeWeight(3);
            //     fill("white");
            //     rect(box.A.x, box.A.y, this.boxSize, this.boxSize);
            // }

            // margin
            if (
                box.long > this.longBoxCount / 10 &&
                box.long < this.longBoxCount / 10 * 9 &&
                box.short > (this.shortBoxCount / 5 * 2) &&
                box.short < (this.shortBoxCount / 5 * 3)
            ) {
                // for (var i = 0; i < this.shortBoxCount; i += 2) {
                // if (box.short >= this.stripe * i && box.short < this.stripe * (i + 1)) {
                if (box.index % 2 == 0) { // 2,3,4

                    // DEBUG
                    // noStroke();
                    // fill("white");
                    // rect(box.A.x, box.A.y, this.boxSize, this.boxSize);

                    box.mask = true;
                    this.columns.add(box.short);
                    this.rows.add(box.long);
                }
                // }
                // }
            }
        }

        this.selectColumnMasks();
    }


    // restructure for columns
    selectColumnMasks() {

        for (var column of this.columns) {
            // console.log(column);
            this.actives[column] = [];
            for (var box of this.boxes) {
                if (box.mask && box.short == column) {
                    this.actives[column].push(box);
                }
            }
        }
    }

    drawMask() {

        this.buffer.push();

        // this.buffer.fill("blue");
        this.buffer.fill(color(BACKGROUND));
        this.buffer.noStroke();

        // draw background shape
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

            this.createMaskContour();
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

    createMaskContour() {

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

    createNoise(start, stop1, stop2, end) {
        this.pointCount = 1000;
        this.noiseWeight = 1;
        this.noiseColor = color("#3a3a3a");

        for (var i = 0; i < this.pointCount; i++) {

            let x = getRandomFromInterval(start.x, end.x);

            // ATTENTION HARD CODED VALUE - y axis
            // let offset = randomGaussian(0, (this.A.y - this.D.y) / 4);
            let offset = randomGaussian(0, 50);
            let t = map(x, start.x, end.x, 0, 1);
            this.baseY = bezierPoint(start.y, stop1.y, stop2.y, end.y, t);
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

    show() {
        push();
        image(this.buffer, 0, 0);
        pop();
    }
}