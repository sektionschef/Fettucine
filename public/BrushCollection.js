class BrushCollection {
    constructor() {
        this.brushCount = 15;


        this.brushes = [];


        for (var i = 0; i < this.brushCount; i++) {
            var data = {
                size: 50,
                strokeSize: 1,
                fillColor: distortColorSuperNew(color(PALETTE.pixelColors[0]), 30),
                strokeColor: distortColorSuperNew(color(PALETTE.pixelColors[1]), 30)
            }
            this.brushes.push(new Brush(data).buffer);
        }
    }

    show() {
        // for debugging
        for (var i = 0; i < this.brushCount; i++) {
            image(this.brushes[i], i * this.brushes[i].width, 0);
        }
    }
}