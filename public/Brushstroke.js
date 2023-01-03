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

    update() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

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

    applyForce(force) {
        this.acc.add(force);
    }

    seek() {
        let force = p5.Vector.sub(this.targetDyn, this.pos);
        this.desiredSpeed = this.maxSpeed;

        // launching at lower speed
        this.distanceToOrigin = p5.Vector.sub(this.origin, this.pos).mag();
        // console.log(this.distanceToOrigin);
        if (this.distanceToOrigin < this.slowRadius) {
            this.desiredSpeed = map(this.distanceToOrigin, 0, this.slowRadius, this.minSpeed, this.maxSpeed);
            // this.desiredSpeed = 50;
        }

        // arrival at target with lower speed
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
        if (this.DEBUG) { fill(color("blue")) };
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
            translate(this.targetDyn.x, this.targetDyn.y);
            fill(color("green"));
            noStroke();
            circle(0, 0, 50);
            pop();

            // target slowRadius
            push();
            translate(this.targetDyn.x, this.targetDyn.y);
            strokeWeight(5);
            stroke(color("green"));
            noFill();
            circle(0, 0, this.slowRadius * 2);
            pop();
        }
    }


}