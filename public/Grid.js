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
        this.bufferForeground = createGraphics(width, height);


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

        this.stripeOrientation = "x";
        // this.stripeOrientation = "y";
        this.paddingX = this.shortBoxCount / 8 * 1; // 5*2
        this.paddingY = this.longBoxCount / 10;
        this.thickness = 1; // in boxes

        this.stripeColumnCount = 2;  // for oreintation x
        this.stripeRowCount = 2;  // for oreintation y

        this.stripes = [];

        if (this.stripeOrientation == "x") {

            this.columnBoxCount = Math.round(this.shortBoxCount / 3); // size of stripe in boxes
            this.columnGap = this.shortBoxCount - this.columnBoxCount * this.stripeColumnCount - this.paddingX * 2; // the loopcount

            for (
                var row = this.paddingY * this.shortBoxCount + this.paddingX;
                row < (this.longBoxCount * this.shortBoxCount - this.paddingY * this.shortBoxCount);
                row += (this.shortBoxCount * this.thickness * 2)
            ) {
                // console.log(row);
                for (var column = 0; column < this.stripeColumnCount; column++) {

                    // get the index of the corner box of each stripe.
                    // let a = row
                    let a = row + this.columnBoxCount * column + this.columnGap * column;
                    // let b = a + this.shortBoxCount - this.paddingX * 2;
                    let b = a + this.columnBoxCount;
                    let c = b + (this.thickness - 1) * this.shortBoxCount;
                    let d = a + (this.thickness - 1) * this.shortBoxCount;

                    // DEBUG
                    // this.buffer.push();
                    // this.buffer.noStroke();
                    // this.buffer.fill("pink");
                    // this.buffer.circle(this.boxes[a].A.x, this.boxes[a].A.y, 50);
                    // // this.buffer.rectMode(CORNERS);
                    // // this.buffer.rect(
                    // //     this.boxes[a].A.x,
                    // //     this.boxes[a].A.y,
                    // //     this.boxes[c].C.x,
                    // //     this.boxes[c].C.y
                    // // );
                    // this.buffer.pop();

                    this.writeToStripes(a, b, c, d);
                }
            }
        } else {

            this.rowBoxCount = Math.round(this.longBoxCount / 2.75); // size of stripe in boxes
            this.rowGap = this.longBoxCount - this.rowBoxCount * this.stripeRowCount - this.paddingY * 2; // the loopcount

            for (
                var column = this.paddingX;
                column < (this.shortBoxCount - this.paddingX);
                column += this.thickness * 2
            ) {
                for (var row = 0; row < this.stripeRowCount; row++) {
                    // get the index of the corner boxe of each stripe.
                    // let a = column + this.paddingY * this.shortBoxCount;
                    let a = column + this.paddingY * this.shortBoxCount + this.rowBoxCount * row * this.shortBoxCount + this.rowGap * row * this.shortBoxCount;
                    let b = a + (this.thickness - 1);
                    // let d = column + (this.longBoxCount - this.paddingY) * this.shortBoxCount;
                    let d = a + this.rowBoxCount * this.shortBoxCount;
                    let c = d + (this.thickness - 1);

                    // DEBUG
                    // this.buffer.push();
                    // this.buffer.noStroke();
                    // this.buffer.fill("pink");
                    // // this.buffer.circle(this.boxes[a].A.x, this.boxes[a].A.y, 50);
                    // // this.buffer.circle(this.boxes[d].A.x, this.boxes[d].A.y, 50);
                    // this.buffer.rectMode(CORNERS);
                    // this.buffer.rect(
                    //     this.boxes[a].A.x,
                    //     this.boxes[a].A.y,
                    //     this.boxes[c].C.x,
                    //     this.boxes[c].C.y
                    // );
                    // this.buffer.pop();

                    this.writeToStripes(a, b, c, d);
                }

            }
        }

    }

    writeToStripes(a, b, c, d) {
        this.A = this.boxes[a].A;
        this.B = this.boxes[b].B;
        this.C = this.boxes[c].C;
        this.D = this.boxes[d].D;

        this.stripes.push({
            "A": this.A,
            "B": this.B,
            "C": this.C,
            "D": this.D,
            "ABStop1": createVector(this.A.x + (this.B.x - this.A.x) / 4, this.A.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset)),
            "ABStop2": createVector(this.A.x + (this.B.x - this.A.x) / 4 * 3, this.A.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset)),
            "BCStop1": createVector(this.C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.C.y + (this.B.y - this.C.y) / 4),
            "BCStop2": createVector(this.C.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.C.y + (this.B.y - this.C.y) / 4 * 3),
            "CDStop1": createVector(this.D.x + (this.C.x - this.D.x) / 4, this.D.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset)),
            "CDStop2": createVector(this.D.x + (this.C.x - this.D.x) / 4 * 3, this.D.y + getRandomFromInterval(-this.bezierOffset, this.bezierOffset)),
            "DAStop2": createVector(this.A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.A.y + (this.D.y - this.A.y) / 4),
            "DAStop1": createVector(this.A.x + getRandomFromInterval(-this.bezierOffset, this.bezierOffset), this.A.y + (this.D.y - this.A.y) / 4 * 3),
        })
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

        // for (var stripe of this.stripes) {
        for (var i = 0; i < this.stripes.length; i++) {
            let stripe = this.stripes[i];
            // NEEDS TO BE RELATIVE TO COLUMN SIZE
            let stripeNext = this.stripes[i + 2];

            // for orientation 2
            // if (fxrand() > 0.9) {
            //     this.A = stripe.A;
            //     this.B = stripe.B;
            //     this.C = stripeNext.C;
            //     this.D = stripeNext.D;
            // } else {
            this.A = stripe.A;
            this.B = stripe.B;
            this.C = stripe.C;
            this.D = stripe.D;
            // }

            this.ABStop1 = stripe.ABStop1;
            this.ABStop2 = stripe.ABStop2;
            this.BCStop1 = stripe.BCStop1;
            this.BCStop2 = stripe.BCStop2;
            this.CDStop1 = stripe.CDStop1;
            this.CDStop2 = stripe.CDStop2;
            this.DAStop2 = stripe.DAStop2;
            this.DAStop1 = stripe.DAStop1;

            this.createMaskContour();
        }

        this.buffer.endShape(CLOSE);
        this.buffer.pop();

        // extra loop outside of beginShape and endShape

        for (var stripe of this.stripes) {
            this.A = stripe.A;
            this.B = stripe.B;
            this.C = stripe.C;
            this.D = stripe.D;

            this.ABStop1 = stripe.ABStop1;
            this.ABStop2 = stripe.ABStop2;
            this.BCStop1 = stripe.BCStop1;
            this.BCStop2 = stripe.BCStop2;
            this.CDStop1 = stripe.CDStop1;
            this.CDStop2 = stripe.CDStop2;
            this.DAStop2 = stripe.DAStop2;
            this.DAStop1 = stripe.DAStop1;

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
        this.pointCount = 2 * p5.Vector.dist(this.A, this.B);
        this.noiseDistance = p5.Vector.dist(this.A, this.C) * 0.01// 25;
        this.noiseWeight = 1;
        this.noiseColor = color("#3a3a3a");

        for (var i = 0; i < this.pointCount; i++) {

            let x = getRandomFromInterval(start.x, end.x);

            let offset = randomGaussian(0, this.noiseDistance);
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
        this.buffer.strokeWeight(1);
        this.buffer.noFill();

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
        this.buffer.stroke(color("#fafafa"));
        this.buffer.strokeWeight(1);
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