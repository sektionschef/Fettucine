// grasp maxforce;

class Brushstroke extends Vehicle {
    constructor(data) {

        // adds a sprite and a moving target on top of vehicle class
        super(data.origin, data.target, data.drawBuffer, false);

        // this.buffer = drawBuffer;

        this.maxSpeed = getRandomFromInterval(data.maxSpeedMin, data.maxSpeedMax); // 8-20 // 15 top speed limit
        this.minSpeed = data.minSpeed // 2;  // minimum speed - prevents from stopping at 0
        this.maxForce = data.maxForce; // 2  // agility for changes, if too little -> overshoot
        this.slowRadius = data.slowRadius; // 400;  // radius in which to slow down
        this.finishedRadius = data.finishedRadius; // 20;  // minimal distance to stop
        this.targetBdist = getRandomFromList(data.targetBdistList); // [50, 100, 200]  // 300 distance between target and target B - offset of target - 
        this.targetBDirection = getRandomFromList(data.targetBDirectionList); // [1, -1] // add 90 or 270 degrees to the target for finding target B
        // for dynamic resizing
        this.basicSizeMin = data.basicSizeMin; // getRandomFromInterval(25, 60);  // 50
        this.basicSizeMax = data.basicSizeMax; // getRandomFromInterval(80, 140);  // 100
        this.turningFactor = data.turningFactor;
        this.OVERLAY = data.OVERLAY;

        this.basicSize = this.basicSizeMax;
        this.origin = data.origin;
        this.finished = false;
        this.DEBUG = data.DEBUG;
        this.desiredSpeed = 0;  // initial value, dynamic actual speed
        this.sprite = data.sprite;
        this.switchTarget = false;

        this.totalDistance = p5.Vector.sub(data.target, this.origin);
        this.targetBAngle = this.totalDistance.heading() + PI / 2 * this.targetBDirection; // or - PI/2
        this.targetB = p5.Vector.add(data.target, p5.Vector.fromAngle(this.targetBAngle, this.targetBdist));
        this.target = new Vehicle(data.target, this.targetB, data.drawBuffer, this.DEBUG);
        // this.turningDistance = this.totalDistance.mag() * getRandomFromInterval(0.2, 0.8) // where the target shiftsback to origin - e.g. half of the distance
        this.turningDistance = this.totalDistance.mag() * this.turningFactor // where the target shiftsback to origin - e.g. half of the distance
    }

    updateTarget() {
        // move to targetB
        this.target.update();
        this.target.show();
        this.target.applyForce(this.target.seek());
    }

    updateBrushstroke() {

        if (this.finished == false) {
            this.update();
            this.updateTarget();

            if (this.distanceToTarget < this.turningDistance && this.switchTarget == false) {
                this.target.target = this.target.origin.copy();
                this.switchTarget = true;
            }

            // dynamic size for speed
            this.basicSize = Math.round(map(this.desiredSpeed, this.minSpeed, this.maxSpeed, this.sprite.width * this.basicSizeMax, this.sprite.width * this.basicSizeMin));

            // if (p5.Vector.dist(this.pos, this.target.target) < this.finishedRadius) {
            if (p5.Vector.dist(this.pos, this.target.pos) < this.finishedRadius) {
                this.finished = true;
            }
        }

    }

    showBrushstroke() {
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
        }

        this.buffer.push();
        this.buffer.translate(this.pos.x, this.pos.y);
        this.buffer.noStroke();
        this.buffer.rotate(this.vel.heading())

        // BRUSH with circle
        /*         
                this.buffer.stroke(170);
                this.buffer.strokeWeight(1);
                this.buffer.fill(color(Math.round(this.turningFactor * 75) + 180));
                this.buffer.circle(0, 0, 50); 
                */

        // BRUSH with image
        this.buffer.imageMode(CENTER);
        // image
        // this.sprite.resize(0, this.basicSize);
        // this.buffer.image(this.sprite, 0, 0);
        // buffer
        if (this.OVERLAY) {
            this.buffer.blendMode(OVERLAY);
        }
        this.buffer.image(this.sprite, 0, 0, 0, this.basicSize);
        // this.buffer.blendMode(BLEND);


        this.buffer.pop();
    }

}