class Hatches {
    constructor(x_start, y_start, x_stop, y_stop, distance_between_lines, colorObject) {
        this.color = colorObject;// color("black");

        this.x_start = x_start;
        this.y_start = y_start;
        this.x_stop = x_stop;
        this.y_stop = y_stop;
        this.distance_between_lines = distance_between_lines;

        this.hatches = [];
        this.buffer = createGraphics(width, height);

        // this.chosen_axis = getRandomFromList(["x", "y", "xy", "yx", "blank"])
        // this.chosen_axis = getRandomFromList(["x", "y", "xy", "yx"])
        this.chosen_axis = getRandomFromList(["yx", "xy", "x&y"])
        // console.log("chosen axis: " + this.chosen_axis);

        this.createHatches();
        this.show();
    }

    createHatches() {
        if (this.chosen_axis == "x") {
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    createVector(
                        this.x_stop,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer,
                ));
            }
        } else if (this.chosen_axis == "y") {
            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        this.y_stop,
                    ),
                    this.color,
                    this.buffer,
                ));
            }
        } else if (this.chosen_axis == "xy") {
            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    createVector(
                        this.x_stop,
                        (this.y_stop - this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer
                ));
            }
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;
            // skip first one
            for (let i = 1; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start),
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    createVector(
                        this.x_stop - this.distance_between_lines * i,
                        (this.y_stop),
                    ),
                    this.color,
                    this.buffer,));
            }
        } else if (this.chosen_axis == "yx") {
            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start + this.distance_between_lines * i,
                        (this.y_stop),
                    ),
                    createVector(
                        (this.x_stop),
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer,
                )
                );
            }
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;

            for (let i = 1; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start,
                        (this.y_stop - this.distance_between_lines * i),
                    ),
                    createVector(
                        (this.x_stop - this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    this.color,
                    this.buffer,
                )
                );
            }
        } else if (this.chosen_axis == "blank") {

        } else if (this.chosen_axis == "x&y") {
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    createVector(
                        this.x_stop,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer,
                ));
            }

            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        this.y_stop,
                    ),
                    this.color,
                    this.buffer,
                ));
            }
        }
    }

    add(hatch) {
        this.hatches.push(hatch);
    }

    show() {
        while (this.check_all_complete() == false) {
            for (var hatch of this.hatches) {
                hatch.update();
                hatch.show();
            }
        }
    }

    check_all_complete() {

        // skip if not needed at all
        if (this.all_lines_complete == false || this.hatches.length > 0) {

            this.hatches_alive_status = [];
            for (var hatch of this.hatches) {

                this.hatches_alive_status.push(hatch.alive);
                // console.log(this.hatches_alive_status)

            }

            return this.hatches_alive_status.every(element => element === false);
        } else {
            return false;
        }

    }

}