    class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load your assets here (e.g., player and box images)
        this.load.image('player', 'path/to/player.png'); // Replace with actual path
        this.load.image('box', 'path/to/box.png'); // Replace with actual path
    }

    create() {
        // Create player
        this.player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
        
        // Create boxes
        this.boxes = this.physics.add.staticGroup();
        const leftBox = this.boxes.create(200, 300, 'box');
        const rightBox = this.boxes.create(600, 300, 'box');

        // Set up overlap detection
        this.physics.add.overlap(this.player, leftBox, () => this.triggerMiniGame('MiniGameA'), null, this);
        this.physics.add.overlap(this.player, rightBox, () => this.triggerMiniGame('MiniGameB'), null, this);

        // Input setup
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (!this.scene.isPaused('MiniGameA') && !this.scene.isPaused('MiniGameB')) {
            this.checkPlayerCollision();
            this.handleMovement();
        }
    }

    handleMovement() {
        const speed = 200;
        this.player.setVelocity(0);

	if(!isPlayingMinigame){
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
        const leftBoxBounds = this.boxes.getChildren()[0].getBounds(); // Assuming the first box is the left box
        const rightBoxBounds = this.boxes.getChildren()[1].getBounds(); // Assuming the second box is the right box
    
        const collidingWithLeftBox = Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, leftBoxBounds);
        const collidingWithRightBox = Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, rightBoxBounds);
        // const isMainScenePaused = !this.scene.isPaused('MainScene');
        // const isMMG1Paused = !this.scene.isPaused('MiniGameA');
        // const isMG2Paused = !this.scene.isPaused('MiniGameB');
        // console.log("isMainScenePaused: " + isMainScenePaused);
        // console.log("MiniGameA: " + isMMG1Paused);
        // console.log("MiniGameB: " + isMG2Paused);
    
        // if (isMainScenePaused) {
            if (!collidingWithLeftBox && !collidingWithRightBox) {
                console.log("The player is NOT colliding with any boxes.");
                isMinigamePlayable = true;
		if(justPlayedMinigame) {
			justPlayedMinigame = false 
		}
            }
        // }
    }
    triggerMiniGame(miniGame) {
        console.log("triggerMiniGame triggered")
        console.log(isMinigamePlayable);
        if (isMinigamePlayable == true){
            isMinigamePlayable = false;
            console.log(isMinigamePlayable)
            if (!this.scene.isPaused(miniGame)) {
                this.scene.pause();
                this.scene.launch(miniGame);
            }
            this.scene.resume();
            console.log("here")
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
	justPlayedMinigame=true
        alert(scoreMessage); // Replace with better UI if desired
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
	isPlayingMinigame=true
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
	justPlayedMinigame = true
	isPlayingMinigame = false
        alert(scoreMessage); // Replace with better UI if desired
    }
}

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
    scene: [MainScene, MiniGameA, MiniGameB],
};

isMinigamePlayable = true;
justPlayedMinigame = false;
isPlayingMinigame = false;
const game = new Phaser.Game(config);
