/** @type {HTMLCanvasElement} */
const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');
const canvas4 = document.getElementById('canvas4');
const ctx4 = canvas4.getContext('2d');
const CANVAS_WIDTH = canvas1.width = canvas2.width = canvas3.width = canvas4.width = 500;
const CANVAS_HEIGHT = canvas1.height = canvas2.height = canvas3.height = canvas4.height =1000;

const numberOfEnemies = 20;
let gameFrame = 0;

class Enemy1 {
    constructor(){
        //scale 参数决定怪物大小
        this.scale = Math.random() * 2 + 1;
        this.image = new Image();
        this.image.src = 'enemy1.png';
        this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / this.scale;
        this.height = this.spriteHeight / this.scale;
        this.x = Math.random() * (canvas1.width - this.width);
        this.y = Math.random() * (canvas1.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); 
    }
    update() {
        //make sprites swinging
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;
        //animate sprites
        if(gameFrame % this.flapSpeed == 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw() {
        ctx1.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y,this.width, this.height)
    }
}

class Enemy2 {
    constructor(){
        this.scale = Math.random() * 2 + 1;
        this.image = new Image();
        this.image.src = 'enemy2.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / this.scale;
        this.height = this.spriteHeight / this.scale;
        this.x = Math.random() * (canvas2.width - this.width);
        this.y = Math.random() * (canvas2.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); 
        this.angle = Math.random() * 2;
        this.curve = Math.random() * 5 + 5;
        this.angleSpeed = Math.random() * 0.2;
    }
    update() {
        //make sprites swinging
        this.x -= this.speed;
        // this.y += Math.random() * 5 - 2.5;
        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;
        if(this.x + this.width < 0) this.x = canvas2.width;
        //animate sprites
        if(gameFrame % this.flapSpeed == 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw() {
        ctx2.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y,this.width, this.height)
    }
}

class Enemy3 {
    constructor(){
        this.scale = Math.random() * 2 + 1;
        this.image = new Image();
        this.image.src = 'enemy3.png';
        this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / this.scale;
        this.height = this.spriteHeight / this.scale;
        this.x = Math.random() * (canvas3.width - this.width);
        this.y = Math.random() * (canvas3.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); 
        this.angle = Math.random() * 360;
        this.angleSpeed = Math.random() * 1.5 + 0.5;
    }
    update() {
        //make sprites swinging
        //decide the route of the enemy
        //cos 与 sin 之间的比值影响其路径
        this.x = canvas3.width/2 * Math.cos(this.angle * Math.PI/200) +
         canvas3.width/2 - this.width/2;
        this.y = canvas3.height/2 * Math.sin(this.angle * Math.PI/300) +
         canvas3.height/2 - this.height/2;
        this.angle += this.angleSpeed;
        if(this.x + this.width < 0) this.x = canvas3.width
        //animate sprites
        if(gameFrame % this.flapSpeed == 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw() {
        ctx3.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y,this.width, this.height)
    }
}

class Enemy4 {
    constructor(){
        this.scale = Math.random() * 2 + 1;
        this.image = new Image();
        this.image.src = 'enemy4.png';
        this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 213;
        this.spriteHeight = 212;
        this.width = this.spriteWidth / this.scale;
        this.height = this.spriteHeight / this.scale;
        this.x = Math.random() * (canvas4.width - this.width);
        this.y = Math.random() * (canvas4.height - this.height);
        this.newX = Math.random() * (canvas4.width - this.width);
        this.newY = Math.random() * (canvas4.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); 
        this.interval = Math.floor(Math.random() * 200 + 50);
    }
    update() {
        //make sprites swinging
        if(gameFrame % this.interval === 0){
            this.newX = Math.random() * (canvas4.width - this.width);
            this.newY = Math.random() * (canvas4.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/60;
        this.y -= dy/60;
        // this.x = 0;
        // this.y = 0;
        //animate sprites
        if(gameFrame % this.flapSpeed == 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw() {
        ctx4.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,this.x, this.y,this.width, this.height)
    }
}

const enemiesArray1 = [];
for(let i=0; i<numberOfEnemies; i++) {
    enemiesArray1.push(new Enemy1());
}
const enemiesArray2 = [];
for(let i=0; i<numberOfEnemies; i++) {
    enemiesArray2.push(new Enemy2());
}
const enemiesArray3 = [];
for(let i=0; i<numberOfEnemies; i++) {
    enemiesArray3.push(new Enemy3());
}
const enemiesArray4 = [];
for(let i=0; i<numberOfEnemies; i++) {
    enemiesArray4.push(new Enemy4());
}

function animate() {
    ctx1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx3.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemiesArray1.forEach(object => {
        object.update();
        object.draw();
    });
    enemiesArray2.forEach(object => {
        object.update();
        object.draw();
    });
    enemiesArray3.forEach(object => {
        object.update();
        object.draw();
    });
    enemiesArray4.forEach(object => {
        object.update();
        object.draw();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();
