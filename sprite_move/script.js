let playerState = 'idle';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
});

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
const spriteWidth = 575;
const spriteHeight = 523;
let gameFrame = 0;
const staggerFrames = 5;
//获取图片每帧的位置
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'gethit',
        frames: 4,
    },
];

    /** @params
     *  state 指代animationStates中的各个状态，可通过其访问其中参数
     *  index 索引*/ 
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let j = 0;j < state.frames; j++ ){
        let positonX = j * spriteWidth;
        let positonY = index * spriteHeight;
        frames.loc.push({x: positonX, y:positonY});
    }
    spriteAnimations[state.name] = frames;
});

function animate() {
    //清除画布，用于每帧图像显示
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    //在画布上显示图像的位置参数，用于定位
    // ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    // sx...:指从图片的哪里开始显示
    // dx...:指在画布上显示的位置
    let positon = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * positon;
    let frameY = spriteAnimations[playerState].loc[positon].y;
    ctx.drawImage(playerImage,frameX,frameY, spriteWidth, 
        spriteHeight, 0, 0, spriteWidth, spriteHeight);
        //降低运行速度
        // if(gameFrame % staggerFrames == 0) {
        //     if (frameX < 6) frameX++;
        //     else frameX = 0;
        // }
        gameFrame++;
    requestAnimationFrame(animate);
};
animate();