window.addEventListener('load', function() {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullScreenButton =  document.getElementById('fullScreenButton');

    class InputHandler {
        constructor() {
            this.keys = [];
            this.touchY = '';
            this.touchTreshold = 30;
            window.addEventListener('keydown',e => {
                if((e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' || 
                    e.key === 'ArrowRight') 
                    && this.keys.indexOf(e.key) === -1) {
                        this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) restartGame();
            });
            window.addEventListener('keyup',e => {
                if( e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' || 
                    e.key === 'ArrowRight') {
                        this.keys.splice(this.keys.indexOf(e.key), 1);
                } 
            });
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                }
                console.log(this.keys);
            });
            window.addEventListener('touchend', e => {
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight; 
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        update(input, deltatime, enemies) {
            // collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2 - 20) - (this.x + this.width/2);
                const dy = (enemy.y + enemy.height/2)- (this.y + this.height/2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width/3 + this.width/3) {
                    gameOver = true;
                }
            });
            // sprite animations
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltatime;
            }

            // controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) {
                this.vy -= 30;
            } else {
                this.speed = 0;
            }
            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            // vertical movement
            this.y += this.vy
            if(!this.onGround()){
                this.vy += this.weight;
                this.maxFrame = 5;
                this.frameY = 1;
            } else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;

        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, 
                this.x, this.y, this.width, this.height);
        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 5;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
        restart(){
            this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('enemyImage');
            this.width = 160;
            this.height = 119;
            this.x = gameWidth;
            this.y = gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width , 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(deltatime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltatime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    function handleEnemies(deltatime) {
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
        if(enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            // console.log(enemies);
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltatime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltatime);
        });
    }

    function displayStatusText(context) {
        ctx.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText("Score: " + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText("Score: " + score, 22, 52);
        if (gameOver) {
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.fillText('GAME OVER, press Enter or swipe down to restart!', canvas.width/2, 200);
            ctx.fillStyle = 'white';
            ctx.fillText('GAME OVER, press Enter or swipe down to restart!', canvas.width/2 + 2, 202);
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click',toggleFullScreen);


    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lasttime = 0;
    let enemyTimer = 0;
    let enemyInterval = 2000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timestamp) {
        const deltatime = timestamp - lasttime;
        lasttime = timestamp; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltatime, enemies);
        handleEnemies(deltatime);
        displayStatusText(ctx);
        if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});