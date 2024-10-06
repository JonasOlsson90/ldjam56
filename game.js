let booted = true;
let splash;
let framerate = 6;
let setAnimFlag = false;
    
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load your assets here (e.g., player and box images)
        this.load.image('player', 'assets/box.png'); // Replace with actual path
        //this.load.image('box', 'assets/button.png'); // Replace with actual path
        this.load.image('office', 'assets/office.png');

        this.load.image('splash', 'assets/splash.png');
        this.load.image('laoban_stand1', 'assets/laoban_stand1.png');
        this.load.image('laoban_stand2', 'assets/laoban_stand2.png');
        this.load.image('laoban_walk1', 'assets/laoban_walk1.png');
        this.load.image('laoban_walk2', 'assets/laoban_walk2.png');

        this.load.image('desk1', 'assets/desk1.png');
        this.load.image('desk2', 'assets/desk2.png');

    }

    create() {
        this.anims.create({
            key: 'laoban_stand',
            frames: [{key: 'laoban_stand1'}, {key: 'laoban_stand2'}],
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'laoban_walk',
            frames: [{key: 'laoban_walk1'}, {key: 'laoban_walk2'}],
            frameRate: framerate,
            repeat: -1
        })

    this.anims.create({
		key: 'desk',
		frames: [{key: 'desk1'}, {key: 'desk2'}],
		frameRate: framerate,
		repeat: -1
	})

        const image1 = this.add.image(0, 0, "office");
        image1.setOrigin(0,0);

        // Create player
        this.player = this.physics.add.sprite(400, 300, 'laoban_stand1').setCollideWorldBounds(true);
	    this.player.anims.play('laoban_stand');
	    this.player.anims.play('laoban_stand');
        
        // Create boxes
        this.boxes = this.physics.add.staticGroup();
        const leftBox = this.boxes.create(200, 300, 'desk1');
        // this.leftBox.anims.play('desk');

        const rightBox = this.boxes.create(600, 300, 'desk1');

        const bottomBox = this.boxes.create(400, 500, 'desk1');

        // Set up overlap detection
        this.physics.add.overlap(this.player, leftBox, () => this.triggerMiniGame('MiniGameA'), null, this);
        this.physics.add.overlap(this.player, rightBox, () => this.triggerMiniGame('MiniGameB'), null, this);
        this.physics.add.overlap(this.player, bottomBox, () => this.triggerMiniGame('MiniGameBalanceLaw'), null, this);

        // Input setup
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.checkPlayerCollision();
        this.handleMovement();
            
        if (booted) {
            booted = false;
            splash = this.physics.add.sprite(0, 0, 'splash');
            splash.setOrigin(0, 0);
            splash.body.setAllowGravity(false);
            game.pause();
        }
    }

    handleMovement() {    
        // console.log("din mamma uppdateras!")    
        // console.log("player vel x: " + this.player.VelocityX);
        // console.log("player vel y: " + this.player);
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;


        // flip that bitch!
        if (this.cursors.right.isDown) {
            this.player.scaleX = -1;
        } else if (this.cursors.left.isDown) {
            this.player.scaleX = 1;
        }

        if(isMoving ){
            // this shit needs to be done just once.
            this.player.anims.play('laoban_walk');
        } else if (!isMoving) {
            // this also needs to be done just once.
            this.player.anims.play('laoban_stand');
        }

        //console.log(isMoving)
        if(isPlayingMinigame || !isMoving){
            this.player.setVelocity(0);
        }

        if(!isPlayingMinigame){
            const speed = 200;
            this.player.setVelocity(0);

            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
		        //this.player.sprite.scale = -1
                this.player.setVelocityX(speed);
            }

            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-speed);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(speed);
            }
        }
    }

    checkPlayerCollision() {
        const playerBounds = this.player.getBounds();
        const leftBoxBounds = this.boxes.getChildren()[0].getBounds();
        const rightBoxBounds = this.boxes.getChildren()[1].getBounds();
        const bottomBoxBounds = this.boxes.getChildren()[2].getBounds();
    
        const collidingWithLeftBox = Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, leftBoxBounds);
        const collidingWithRightBox = Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, rightBoxBounds);
        const collidingWithBottomBox = Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, bottomBoxBounds);

        const isAnythingCollidingWithAnything = collidingWithLeftBox || collidingWithRightBox || collidingWithBottomBox;
    
        if (!isAnythingCollidingWithAnything) {
            isMinigamePlayable = true;
            if(justPlayedMinigame) {
                justPlayedMinigame = false 
            }
        }
    }

    triggerMiniGame(miniGame) {
        // console.log("isMinigamePlayable: " + isMinigamePlayable);
        if (isMinigamePlayable === true){
            isMinigamePlayable = false;
            // console.log("isMinigamePlayable: " + isMinigamePlayable)
            if (!this.scene.isPaused(miniGame)) {
                this.scene.pause();
                this.scene.launch(miniGame);
            }
            this.scene.resume();
        }
    }
}

class MiniGameA extends Phaser.Scene {
    isPressed = false;
    constructor() {
        super({ key: 'MiniGameA' });
    }

    create() {
        this.counter = 0;
        this.timerText = this.add.text(400, 300, 'MiniGame A: Press A', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-A', this.incrementCounter, this);
        this.input.keyboard.on('keyup-A', this.onKeyUp, this);
        this.time.delayedCall(3000, this.endMiniGame, [], this);
        isPlayingMinigame=true;
    }

    onKeyUp() {
        this.isPressed = false;
    }

    incrementCounter() {
        if (!this.isPressed) {
            this.counter++;
            this.isPressed = true;
        }
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-A', this.incrementCounter, this);
        this.input.keyboard.off('keyup-A', this.onKeyUp, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        const scoreMessage = `MiniGame A ended! You pressed 'A' ${this.counter} times.`;
        console.log(scoreMessage);
	    justPlayedMinigame=true;
        isPlayingMinigame = false;
    }
}

class MiniGameB extends Phaser.Scene {
    isPressed = false;
    constructor() {
        super({ key: 'MiniGameB' });
    }

    create() {
        this.counter = 0;
        this.timerText = this.add.text(400, 300, 'MiniGame B: Press B', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-B', this.incrementCounter, this);
        this.input.keyboard.on('keyup-B', this.onKeyUp, this);
        this.time.delayedCall(3000, this.endMiniGame, [], this);
	    isPlayingMinigame=true;
    }

    onKeyUp() {
        this.isPressed = false;
    }

    incrementCounter() {
        if (!this.isPressed) {
            this.counter++;
            this.isPressed = true;
        }
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-B', this.incrementCounter, this);
        this.input.keyboard.off('keyup-B', this.onKeyUp, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        const scoreMessage = `MiniGame B ended! You pressed 'B' ${this.counter} times.`;
        console.log(scoreMessage);
        justPlayedMinigame = true;
        isPlayingMinigame = false;
    }
}

let factor = 1.2;
let divider = 4;
let degrees = 0;
class MiniGameBalanceLaw extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGameBalanceLaw' });
    }

    create() {
        if (Math.floor(Math.random() * 10) % 2 === 0){
            this.counter = 1;
        } else {
            this.counter = -1;
        }
        this.timerText = this.add.text(400, 300, 'MiniGame C: Press LEFT and RIGHT', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-RIGHT', this.incrementCounter, this);
        this.input.keyboard.on('keydown-LEFT', this.decrementCounter, this);
        this.time.delayedCall(15000, this.endMiniGame, [], this);
	    isPlayingMinigame=true;
    }

    incrementCounter() {
        this.counter += 5;
    }

    decrementCounter() {
        this.counter -= 5;
    }

    update() {
        if (this.counter > 0) {
            this.counter += factor;
        }
        if (this.counter < 0) {
            this.counter -= factor;
        }
        // factor *= this.counter;
        degrees = this.counter / divider;
        console.log(degrees);
        if (degrees > 50 || degrees < -50) {
            this.endMiniGame();
        }
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-C', this.incrementCounter, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        const scoreMessage = `End balance is ${degrees}`;
        console.log(scoreMessage);
        justPlayedMinigame = true;
        isPlayingMinigame = false;
    }
}

window.addEventListener('keydown', function(event) {
    if (event.code === 'Enter' && game.isPaused) {
        splash.destroy();
        game.resume();
    }
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [MainScene, MiniGameA, MiniGameB, MiniGameBalanceLaw],
};

isMinigamePlayable = true;
justPlayedMinigame = false;
isPlayingMinigame = false;
const game = new Phaser.Game(config);
