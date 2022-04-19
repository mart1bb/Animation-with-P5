let canvaX = 1520
let canvaY = 700
let vitesse = 1
mesBalles = []
let nbX = 10
let nbY = 3
let nbTot = nbX*nbY
let radius = 20
let k = 500;
let decreCoef = 0.01
let charge = 3
let data = []
let nombre = 0
let refEner = 0;

function setup() {
    createCanvas(canvaX,canvaY)
    
    for(let i = 0 ; i < nbX ; i++){
        for(let j = 0 ; j < nbY ; j++){
            mesBalles.push(new Balle(createVector((i+1)*(canvaX/nbX)-(canvaX/nbX)/2,(j+1)*(canvaY/nbY)-(canvaY/nbY)/2), createVector(random(-vitesse,vitesse),random(-vitesse,vitesse)), radius, charge))
        }
    }
    refEner = energie(mesBalles)
}

function draw() {
    background(0)
    maCuve = new Cuve()
    for(let i = 0 ; i < nbTot ; i++){
        this.mesBalles[i].update()
        //this.mesBalles[i].bounce()
        this.mesBalles[i].decrease(decreCoef)
        //this.mesBalles[i].pressure(this.mesBalles)
    }
    
    for(let i = 0 ; i < nbTot ; i++){
        this.mesBalles[i].show()
    }
    

    for(let i = 0 ; i < nbTot ; i++){
        this.maCuve.magnetic(this.mesBalles[i], 5000)
        for(let j = 0 ; j < nbTot ; j++){
            if(i != j){
                this.mesBalles[i].collision(this.mesBalles[j])
                this.mesBalles[i].magnetic(this.mesBalles[j])
            }
        }
    }
    //graph()
    regulation()
}

function graph() {
    let r = 1
    let length = 300
    let top = 200;
    // if(data != null && data.length != 0){
    //     top = max(data)
    // } else{
    //     top = 200
    // }
    let borneInf = 1520-length
    stroke(10)
    line(borneInf,200,1520,200)
    let moy = 0
    data.push(round(energie(mesBalles),0))
    for(let i = 0; i < data.length ; i++) {
        if(data[i] > top){
            stroke(10)
            fill(255)
            ellipse(borneInf+i,0,r,r)
        }else if(data[i] < 0){
            stroke(10)
            fill(255)
            ellipse(borneInf+i,top,r,r)
        } else{
            stroke(10)
            fill(255)
            ellipse(borneInf+i,top-data[i],r,r)
        }
        moy+=abs(data[i])
    }


    moy = top-(moy/data.length)

    if(top-moy > refEner+5){
        decreCoef = 0.01
    } else if(top-moy < refEner-5){
        decreCoef = -0.01
    } else {
        decreCoef = 0.01
    }
    text(decreCoef,borneInf-35,moy-5)
    text(round(refEner,0),borneInf-35,moy-20)

    line(borneInf,moy,1520,moy)
    fill(0)
    text(round(top-moy,1),borneInf-35,moy+5)
    if(data.length > length){
        data.splice(0,1)
    } 
}

function regulation() {
    let moy = 0
    data.push(round(energie(mesBalles),0))
    for(let i = 0; i < data.length ; i++) {
        moy+=abs(data[i])
    }
    moy = moy/data.length
    if(moy > refEner+50){
        decreCoef = 0.01
    } else if(moy < refEner+30){
        decreCoef = -0.01
    } else {
        decreCoef = 0.01
    }
    fill(255)
    textSize(15)
    text(round(moy),1400,20)
    text(round(refEner),1450,20)
    text(decreCoef,1480,20)
}

function tourner(vel, angle) {
    const tournerdVelocities = {
        x: vel.x * Math.cos(angle) - vel.y * Math.sin(angle),
        y: vel.x * Math.sin(angle) + vel.y * Math.cos(angle)
    }
    return tournerdVelocities
}

function energie(myBalls){
    let somme = 0;
    for(let i = 0 ; i < myBalls.length ; i++){
        somme+=abs(myBalls[i].vel.x)+abs(myBalls[i].vel.y);
    }
    return somme;
}

function Balle(pos,vel,r,q) {
    this.pos = pos
    this.vel = vel
    this.r = 20
    this.mass = 1
    this.charge = q
    this.path = []
    this.color = 0;


    this.show = function() {
        // fill(this.color,0,255-this.color)
        // ellipse(this.pos.x,this.pos.y,this.r,this.r);

		noStroke();
        fill(abs(this.vel.x*200),0,abs(this.vel.y*200))
		ellipse(this.pos.x,this.pos.y,this.r,this.r);
        //stroke(30);
        noStroke();
        //fill((this.pos.x/1520)*255,(this.pos.y/700)*255,(this.pos.x/1520)*255)
		for (let i = 0; i < this.path.length-1 ; i++){
			ellipse(this.path[i].x, this.path[i].y, i, i)
            //line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y)
		}
        
    }

    this.pressure = function(balls){
        let seuil = 130;
        let d = 1500
        for(let i = 0 ; i < balls.length; i++){
            let temp = dist(this.pos.x,this.pos.y,balls[i].pos.x,balls[i].pos.y)
            if(temp < d && temp > 5){
                d = temp
            }    
        }
        if(d < seuil ){
            this.color = 255-((d*d)/(seuil*seuil))*255
        } else{
            this.color = 0
        }
    }

    this.update = function() {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        this.path.push(this.pos.copy())
		if(this.path.length > 25){
			this.path.splice(0,1)
		}
    }

    this.decrease = function(coef) {
        let a = 0.05
        if(this.vel.x > a){
            this.vel.x -= coef
        }
        if(this.vel.y > a){
            this.vel.y -= coef
        }
        if(this.vel.x < -a){
            this.vel.x += coef
        }
        if(this.vel.y < -a){
            this.vel.y += coef
        }
    }

    this.bounce = function() {
        if(this.pos.x > 1520-this.r/2 || this.pos.x < this.r/2){
            this.vel.x = -this.vel.x
            if(this.pos.x > 1520-this.r/2){
                this.pos.x = 1520-this.r/2
            } else if(this.pos.x < this.r/2){
                this.pos.x = this.r/2
            } 

        }
        if(this.pos.y > 700-this.r/2 || this.pos.y < this.r/2){
            this.vel.y = -this.vel.y 
            if(this.pos.y > 700-this.r/2){
                this.pos.y = 700-this.r/2
            } else if(this.pos.y < this.r/2){
                this.pos.y = this.r/2
            } 
        }
    }

    this.collision = function(friends){ 
        
        if(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) < this.r){  
            
            let xvelDiff = this.vel.x - friends.vel.x;
            let yvelDiff = this.vel.y - friends.vel.y;
        
            let xDist = friends.pos.x - this.pos.x;
            let yDist = friends.pos.y - this.pos.y;
        
            // Prevent accidental overlap of this
            if (xvelDiff * xDist + yvelDiff * yDist >= 0) {
        
                // Grab angle between the two colliding ball
                const angle = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);
        
                // Store mass in var for better readability in collision equation
                const m1 = this.mass;
                const m2 = friends.mass;
        
                // vel before equation
                const u1 = tourner(this.vel, angle);
                const u2 = tourner(friends.vel, angle);
        
                // vel after 1d collision equation
                const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
                const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
        
                // Final vel after rotating axis back to original location
                const vFinal1 = tourner(v1, -angle);
                const vFinal2 = tourner(v2, -angle);
        
                // Swap this velocities for realistic bounce effect
                this.vel.x = vFinal1.x;
                this.vel.y = vFinal1.y;
        
                friends.vel.x = vFinal2.x;
                friends.vel.y = vFinal2.y;
            }
        }
    }

    this.adaptspeed = function(friends, coef) {
        if(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) < 200 && dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) > 195){
            let angle2 = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);

            let vel1 = tourner(this.vel, angle2);

            vel1 = { x: vel1.x+coef, y: vel1.y}

            let finalS = tourner(vel1, -angle2)

            this.vel = finalS 
        }
        if(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y) < 160){
            let angle2 = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);

            let vel1 = tourner(this.vel, angle2);

            vel1 = { x: this.charge*friends.charge, y: vel1.y}

            let finalS = tourner(vel1, -angle2)

            this.vel = finalS
        }
    }

    this.magnetic = function(friends) {
        let angle = -Math.atan2(friends.pos.y - this.pos.y, friends.pos.x - this.pos.x);

        let vel1 = tourner(this.vel, angle);

        vel1 = { x: vel1.x-((this.charge*friends.charge*k)/(dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y)*dist(this.pos.x,this.pos.y,friends.pos.x,friends.pos.y))), y: vel1.y}

        let finalS = tourner(vel1, -angle)

        this.vel = finalS
    }
}

this.Cuve = function() {
    this.show = function(){
        stroke(30)
        line(0,0,0,canvaY)
        line(0,canvaY,canvaX,canvaY)
        line(canvaX,canvaY,canvaX,0)
        line(0,0,canvaX,0)
    }
    

    this.magnetic = function(friends, charge) {
        //friends.vel.x = friends.vel.x + (charge/friends.pos.x) - (charge/(canvaX-friends.pos.x))
        //friends.vel.y = friends.vel.y + (charge/friends.pos.y) - (charge/(canvaY-friends.pos.y))
        friends.vel.x = friends.vel.x + (charge/(friends.pos.x*friends.pos.x)) - (charge/((canvaX-friends.pos.x)*(canvaX-friends.pos.x)))
        friends.vel.y = friends.vel.y + (charge/(friends.pos.y*friends.pos.y)) - (charge/((canvaY-friends.pos.y)*(canvaY-friends.pos.y)))
    }
}