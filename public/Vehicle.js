class Vehicle {
    constructor(origin, target) {
        this.maxSpeed = 15;  // top speed limit
        this.minSpeed = 2;  // minimum speed - prevents from stopping at 0
        this.maxForce = 2;  // agility for changes, if too little -> overshoot
        this.slowRadius = 500;  // radius in which to slow down
        this.basicSize = 75;
        this.DEBUG = true;

        this.origin = origin;
        this.target = target;
        this.pos = this.origin.copy();  // start position
        this.vel = p5.Vector.sub(this.target, this.origin);  // make the starting angle
        this.acc = createVector(0, 0);
    }

    update() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    seek() {
        let force = p5.Vector.sub(this.target, this.pos);
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

        push();
        translate(this.pos.x, this.pos.y);
        fill(color("blue"));
        noStroke();
        rotate(this.vel.heading())
        triangle(0, -this.basicSize / 4, this.basicSize, 0, 0, this.basicSize / 4);
        pop();

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