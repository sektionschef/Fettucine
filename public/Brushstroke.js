class Brushstroke {
    constructor() {
        this.maxSpeed = createVector(2, 2);
        this.maxForce = createVector(2, 2);
        this.basicSize = 100;

        this.pos = createVector(width / 2, height / 2);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
    }

    update() {
        this.vel.add(this.acc)
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    applyForce() {
        this.acc.add(force);
    }

    show() {
        this.update();

        push();
        translate(this.pos.x, this.pos.y);
        fill(color("red"));
        noStroke();
        rotate(this.vel.heading())
        triangle(0, -this.basicSize / 4, this.basicSize, 0, 0, this.basicSize / 4);
        pop();
    }
}