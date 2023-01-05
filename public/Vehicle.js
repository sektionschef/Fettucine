class Vehicle {
    constructor(origin, target, drawBuffer, debug = true) {
        this.buffer = drawBuffer;

        this.maxSpeed = getRandomFromInterval(15, 30);  // 30 top speed limit
        this.minSpeed = 2;  // minimum speed - prevents from stopping at 0
        this.maxForce = 2;  // agility for changes, if too little -> overshoot
        this.slowRadius = 200;  // radius in which to slow down
        this.basicSize = 75;  // size of element
        this.DEBUG = debug;

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

    seek(moving_target = false) {
        let force;

        if (moving_target) {
            // the instance of vehicle object rather than 
            force = p5.Vector.sub(this.target.pos, this.pos);
        } else {
            force = p5.Vector.sub(this.target, this.pos);
        }

        this.desiredSpeed = this.maxSpeed;

        // launching at lower speed
        this.distanceToOrigin = p5.Vector.sub(this.origin, this.pos).mag();
        if (this.distanceToOrigin < this.slowRadius) {
            this.desiredSpeed = map(this.distanceToOrigin, 0, this.slowRadius, this.minSpeed, this.maxSpeed);
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
        // this.update();

        if (this.DEBUG) {
            // origin DEBUG        
            this.buffer.push();
            this.buffer.translate(this.origin.x, this.origin.y);
            this.buffer.fill(color("orange"));
            this.buffer.noStroke();
            this.buffer.circle(0, 0, 50);
            this.buffer.pop();

            // target slowRadius
            this.buffer.push();
            this.buffer.translate(this.origin.x, this.origin.y);
            this.buffer.strokeWeight(5);
            this.buffer.stroke(color("orange"));
            this.buffer.noFill();
            this.buffer.circle(0, 0, this.slowRadius * 2);
            this.buffer.pop();

            this.buffer.push();
            this.buffer.translate(this.pos.x, this.pos.y);
            this.buffer.fill(color("blue"));
            this.buffer.noStroke();
            this.buffer.rotate(this.vel.heading())
            this.buffer.triangle(0, -this.basicSize / 4, this.basicSize, 0, 0, this.basicSize / 4);
            this.buffer.pop();

            // target DEBUG        
            this.buffer.push();
            this.buffer.translate(this.target.x, this.target.y);
            this.buffer.fill(color("green"));
            this.buffer.noStroke();
            this.buffer.circle(0, 0, 50);
            this.buffer.pop();

            // target slowRadius
            this.buffer.push();
            this.buffer.translate(this.target.x, this.target.y);
            this.buffer.strokeWeight(5);
            this.buffer.stroke(color("green"));
            this.buffer.noFill();
            this.buffer.circle(0, 0, this.slowRadius * 2);
            this.buffer.pop();
        }
    }
}