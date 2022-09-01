export class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = 3;
        this.markedForDeletion = false;
        this.image = projectile;
    }
    update() {
        this.x += this.speed;
        if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }
}

export class Particle {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = gears;
        this.frameX = Math.floor(Math.random() * 3);
        this.frameY = Math.floor(Math.random() * 3); 
        this.spriteSize = 50;
        this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
        this.size = this.spriteSize * this.sizeModifier;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * -15;
        this.gravity = 0.5;
        this.markedForDeletion = false;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
        this.bounced = 0;
        this.bottomBounceBoundary = Math.random() * 80 + 60; 
    }
    update() {
        this.angle += this.va;
        this.speedY += this.gravity;
        this.x -= this.speedX - this.game.speed;
        this.y += this.speedY;
        if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;
        if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2) {
            this.bounced++;
            this.speedY *= -0.7
        } 
    }
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
        context.restore();
    }
}   

export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Bangers';
        this.color = 'white';
    }
    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        // score
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.fillText('Score: ' + this.game.score, 20, 40);
        // timer
        const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
        context.fillText('Timer: ' + formattedTime, 20, 100);
        // game over messages
        if (this.game.gameOver) {
            context.textAlign = 'center';
            let message1;
            let message2;
            if (this.game.score > this.game.winningScore) {
                message1 = 'Most Wondrous!';
                message2 = 'Well done explorer!';
            } else {
                message1 = 'Blazes!';
                message2 = 'Get my repair kit and try again!'
            }
            context.font = '70px ' + this.fontFamily;
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = '25px ' + this.fontFamily;
            context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
        }
        // ammo
        if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
        for(let i = 0; i < this.game.ammo; i++) {
            context.fillRect(20 + 5 * i, 50, 3, 20);
        }
        context.restore();
    }
}

export class Explosion {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.fps = 60;
        this.timer = 0;
        this.interval = 1000/this.fps;
        this.markedForDeletion = false;
        this.maxFrame = 8;
    }
    update(deltatime) {
        this.x -= this.game.speed;
        if (this.timer > this.interval) {
            this.frameX++;
            this.timer = 0;
        } else {
            this.timer += deltatime;
        }
        if (this.frameX > this.maxFrame) this.markedForDeletion = true;
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

export class SmokeExplosion extends Explosion {
    constructor(game, x, y) {
        super(game, x, y);
        this.image = smokeExplosion;
    }
}

export class FireExplosion extends Explosion {
    constructor(game, x, y) {
        super(game, x, y);
        this.image = fireExplosion;
    }
}