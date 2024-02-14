

function Particle (){
    this.pos = createVector (random(width),random(height)); //position
    this.vel = createVector (0,0); //speed in a given direction
    this.acc = createVector (0,0); //accelaration
    this.maxspeed=4;


    this.prevPos = this.pos.copy();

    this.update = function (){
        this.vel.add(this.acc); //accelaration gets added the velocity
        this.vel.limit(this.maxspeed);
        this.pos.add (this.vel); //the velocity gets added the position 
        this.acc.mult(0); //reset the accelaration to zero by multipluing the vector
    }
    this.follow = function (vectors){
        var x = Math.floor (this.pos.x/scl);
        var y = Math.floor (this.pos.y/scl);
        var index = x + y*cols;
        var force = vectors [index];
        this.applyForce(force);
    }

    this.applyForce = function (force){ //new function that receives force
        this.acc.add (force); //add the force to the accelaration 
    }

    this.show= function (){ //show dots
        colorMode(HSB, 360,100,100,100);
        this.hue = drawingParams.hue;


        stroke(210, 97, 88);
        // fill(120, 30, 0,50);
        // triangle(this.pos.x, this.pos.y, this.pos.x - 100, this.pos.y -50, this.pos.x -100, this.pos.y + 50);
        fill(200, 69, 98, 80);
        ellipse (this.pos.x, this.pos.y,30, 30);
        
        noStroke();
        var particleColor = color(40, 89, 100, 80);
        fill(particleColor);
        ellipse(this.prevPos.x, this.prevPos.y, 15,15);


        var trailColor = color((this.hue+ 180), 100,100,50);
        fill(trailColor);
        strokeWeight(2);
        line (this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    
        this.updatePrev();
    }

    this.updatePrev = function(){
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;

    }

    this.edges = function(){
        if (this.pos.x>width) {
            this.pos.x =0;
            this.updatePrev ();
        }

        if (this.pos.x<0) {
             this.pos.x =width;
             this.updatePrev ();
            }

        if (this.pos.y>height) { 
             this.pos.y =0; 
             this.updatePrev ();
            }

        if (this.pos.y<0) {
            this.pos.y =height;
            this.updatePrev ();
        }
    }
}