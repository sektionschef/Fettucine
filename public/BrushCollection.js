class BrushCollection {
    constructor(data) {

        this.brushes = [];

        for (var i = 0; i < this.brushTemplateCount; i++) {
            var data = {
                size: this.brushTemplateSize,
                strokeSize: this.brushTemplateStrokeSize,
                fillColor: distortColorSuperNew(this.brushTemplateFillColor, this.brushTemplateFillColorDistort),
                strokeColor: distortColorSuperNew(this.brushTemplateStrokeColor, this.brushTemplateStrokeColorDistort)
            }
            this.brushes.push(new Brush(data).buffer);
        }
    }

    show() {
        // for debugging - list them all
        for (var i = 0; i < this.brushes.length; i++) {
            image(this.brushes[i], i * this.brushes[i].width, 0);
        }
    }
}