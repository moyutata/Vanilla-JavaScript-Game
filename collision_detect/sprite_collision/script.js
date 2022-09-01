/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 700;
const explosion = [];
const canvasPosition = canvas.getBoundingClientRect();

class Explosion {
    constructor(x, y) {
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
    }
    update() {
        if(this.frame === 0) this.sound.play();
        this.timer++;
        if(this.timer % 10 === 0) {
            this.frame++;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, 
            this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        ctx.restore();
    }
}

window.addEventListener('click', function(e) {
    createAnimation(e)
});


function createAnimation(e) {
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosion.push(new Explosion(positionX, positionY));
}

function animate() {
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    for(let i = 0; i < explosion.length; i++) {
        explosion[i].update();
        explosion[i].draw();
        //delete explosion animation
        if (explosion[i].frame > 5) {
            explosion.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();