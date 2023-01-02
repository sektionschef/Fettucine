class Brushstroke {
    constructor(sprite) {
        this.maxSpeed = 15;
        this.minSpeed = 2;
        this.desiredSpeed = 0;
        this.maxForce = 2;
        this.slowRadius = 500;  // when to slow down
        this.DEBUG = false;

        this.basicSizeMin = 50;  // for debug
        this.basicSizeMax = 100;  // for debug
        this.basicSize = this.basicSizeMax;  // for debug

        this.target = createVector(width / 4 * 3, height / 8 * 6);
        this.origin = createVector(width / 2, height / 2);

        this.pos = this.origin.copy();
        // this.vel = createVector(0, 0);
        this.vel = p5.Vector.sub(this.target, this.origin);  // make the starting angle
        this.acc = createVector(0, 0);

        this.sprite = sprite;


    }

    update() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        this.basicSize = Math.round(map(this.desiredSpeed, 0, this.maxSpeed, this.basicSizeMax, this.basicSizeMin));
    }

    applyForce(force) {
        this.acc.add(force);
    }

    seek() {
        let force = p5.Vector.sub(this.target, this.pos);
        this.desiredSpeed = this.maxSpeed;

        // launching
        this.distanceToOrigin = p5.Vector.sub(this.origin, this.pos).mag();
        // console.log(this.distanceToOrigin);
        if (this.distanceToOrigin < this.slowRadius) {
            this.desiredSpeed = map(this.distanceToOrigin, 0, this.slowRadius, this.minSpeed, this.maxSpeed);
            // this.desiredSpeed = 50;
        }

        // arrival at target
        this.distanceToTarget = force.mag();
        if (this.distanceToTarget < this.slowRadius) {
            this.desiredSpeed = map(this.distanceToTarget, 0, this.slowRadius, 0, this.maxSpeed);
        }

        force.setMag(this.desiredSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        return force;
    }

    show() {
        this.update();

        if (this.DEBUG) {
            // origin DEBUG        
            push();
            translate(this.origin.x, this.origin.y);
            fill(color("orange"));
            noStroke();
            circle(0, 0, 50);
            pop();

            // target slowRadius
            push();
            translate(this.origin.x, this.origin.y);
            strokeWeight(5);
            stroke(color("orange"));
            noFill();
            circle(0, 0, this.slowRadius * 2);
            pop();
        }

        push();
        translate(this.pos.x, this.pos.y);
        fill(color(PALETTE.pixelColors[2]));
        noStroke();
        rotate(this.vel.heading())
        imageMode(CENTER);
        // image
        // this.sprite.resize(0, this.basicSize);
        // image(this.sprite, 0, 0);
        // buffer
        image(this.sprite, 0, 0, 0, this.basicSize);
        if (this.DEBUG) {
            triangle(0, -this.basicSize / 4, this.basicSize, 0, 0, this.basicSize / 4);
        }
        pop();

        if (this.DEBUG) {
            // target DEBUG        
            push();
            translate(this.target.x, this.target.y);
            fill(color("green"));
            noStroke();
            circle(0, 0, 50);
            pop();

            // target slowRadius
            push();
            translate(this.target.x, this.target.y);
            strokeWeight(5);
            stroke(color("green"));
            noFill();
            circle(0, 0, this.slowRadius * 2);
            pop();
        }
    }


}