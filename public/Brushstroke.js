// grasp maxforce;

class Brushstroke {
    constructor(sprite) {
        this.maxSpeed = 15;  // top speed limit
        this.minSpeed = 2;  // minimum speed - prevents from stopping at 0
        this.maxForce = 2;  // agility for changes, if too little -> overshoot
        this.slowRadius = 500;  // radius in which to slow down

        this.DEBUG = true;
        // for dynamic resizing
        this.basicSizeMin = 50;
        this.basicSizeMax = 100;
        this.basicSize = this.basicSizeMax;

        this.desiredSpeed = 0;  // initial value, dynamic actual speed
        this.target = createVector(width / 4 * 3, height / 8 * 6);
        this.origin = createVector(width / 2, height / 2);

        this.pos = this.origin.copy();  // start position
        this.targetDyn = this.target.copy();
        this.vel = p5.Vector.sub(this.target, this.origin);  // make the starting angle
        this.acc = createVector(0, 0);

        this.switchTargetMoveA = false;
        this.switchTargetMoveB = false;
        this.sprite = sprite;
    }

    updateBrushstroke() {
        this.update()

        this.basicSize = Math.round(map(this.desiredSpeed, 0, this.maxSpeed, this.basicSizeMax, this.basicSizeMin));

        if (this.distanceToTarget < 800 && this.switchTargetMoveA == false) {
            this.targetDyn = p5.Vector.add(this.target, p5.Vector.random2D().mult(100));
            this.switchTargetMoveA = true;
        }
        if (this.distanceToTarget < 300 && this.switchTargetMoveB == false) {
            this.targetDyn = this.target.copy();
            this.switchTargetMoveB = true;
        }
    }

    showBrushstroke() {

        if (this.DEBUG) {
            this.show();
        }

        push();
        translate(this.pos.x, this.pos.y);
        noStroke();
        rotate(this.vel.heading())
        imageMode(CENTER);
        // image
        // this.sprite.resize(0, this.basicSize);
        // image(this.sprite, 0, 0);
        // buffer
        image(this.sprite, 0, 0, 0, this.basicSize);
        pop();

    }

}