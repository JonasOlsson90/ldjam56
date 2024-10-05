let booted = true;
let splash;
    
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load your assets here (e.g., player and box images)
        this.load.image('player', 'assets/box.png'); // Replace with actual path
        this.load.image('box', 'assets/button.png'); // Replace with actual path
        this.load.image('splash', 'assets/splash.png');
    }

    create() {
        // Create player
        this.player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
        
        // Create boxes
        this.boxes = this.physics.add.staticGroup();
        const leftBox = this.boxes.create(200, 300, 'box');
        const rightBox = this.boxes.create(600, 300, 'box');
        const bottomBox = this.boxes.create(400, 500, 'box');

        // Set up overlap detection
        this.physics.add.overlap(this.player, leftBox, () => this.triggerMiniGame('MiniGameA'), null, this);
        this.physics.add.overlap(this.player, rightBox, () => this.triggerMiniGame('MiniGameB'), null, this);
        this.physics.add.overlap(this.player, bottomBox, () => this.triggerMiniGame('MiniGameC'), null, this);

        // Input setup
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        //if (!this.scene.isPaused('MiniGameA') && !this.scene.isPaused('MiniGameB')) {
            this.checkPlayerCollision();
            this.handleMovement();
            
        // booted = false;
        if (booted) {
            booted = false;
            splash = this.physics.add.sprite(0, 0, 'splash');
            splash.setOrigin(0, 0);
            splash.body.setAllowGravity(false);
            game.pause();

        }
        //}
    }

    handleMovement() {    
        console.log("din mamma uppdateras!")    
        // console.log("player vel x: " + this.player.VelocityX);
        // console.log("player vel y: " + this.player);
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;

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
    
        if (isAnythingCollidingWithAnything) {
            isMinigamePlayable = true;
            if(justPlayedMinigame) {
                justPlayedMinigame = false 
            }
        }
    }

    triggerMiniGame(miniGame) {
        
        // console.log("isMinigamePlayable: " + isMinigamePlayable);
        if (isMinigamePlayable == true){
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
        this.time.delayedCall(3000, this.endMiniGame, [], this);
        isPlayingMinigame=true;
    }

    incrementCounter() {
        this.counter++;
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-A', this.incrementCounter, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        const scoreMessage = `MiniGame A ended! You pressed 'A' ${this.counter} times.`;
        console.log(scoreMessage);
	    justPlayedMinigame=true;
        isPlayingMinigame = false;
    }
}

class MiniGameB extends Phaser.Scene {
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
        this.time.delayedCall(3000, this.endMiniGame, [], this);
	    isPlayingMinigame=true;
    }

    incrementCounter() {
        this.counter++;
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-B', this.incrementCounter, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        const scoreMessage = `MiniGame B ended! You pressed 'B' ${this.counter} times.`;
        console.log(scoreMessage);
        justPlayedMinigame = true;
        isPlayingMinigame = false;
    }
}

class MiniGameC extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGameC' });
    }

    create() {
        this.counter = 0;
        this.timerText = this.add.text(400, 300, 'MiniGame C: Press C', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-C', this.incrementCounter, this);
        this.time.delayedCall(3000, this.endMiniGame, [], this);
	    isPlayingMinigame=true;
    }

    incrementCounter() {
        this.counter++;
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-C', this.incrementCounter, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        const scoreMessage = `MiniGame C ended! You pressed 'B' ${this.counter} times.`;
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
    scene: [MainScene, MiniGameA, MiniGameB, MiniGameC],
};

isMinigamePlayable = true;
justPlayedMinigame = false;
isPlayingMinigame = false;
const game = new Phaser.Game(config);
