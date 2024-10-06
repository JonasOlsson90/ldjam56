let booted = true;
let splash;
let framerate = 6;
let isWalking = false;
let isMinigameActive = false;
let minigameCounts = {MiniGameA: 0, MiniGameB: 0, MiniGameBalanceLaw: 0};
let boxNames = ["MiniGameA", "MiniGameB", "MiniGameBalanceLaw"];
    
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.timeRemaining = 30; // Countdown from 30 seconds
        this.timerText = null; // To hold the text object
        this.timerEvent = null; // To hold the timer event
        // this.boxCounts = [0, 0, 0]; // Initialize counts for each box
        this.boxTextObjects = []; // To hold text objects above boxes
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
	    this.physics.add.existing(this.player);
        this.player.anims.play('laoban_stand');
	    this.player.anims.play('laoban_stand');
        
        // Create desks

        this.leftDesk = this.physics.add.sprite(200,300, 'desk1');
        this.physics.add.existing(this.leftDesk);
        this.leftDesk.anims.play('desk')
        this.createCounterText(200, 260, "MiniGameA"); // Position above the left box

        this.rightDesk = this.physics.add.sprite(600,300, 'desk1');
        this.rightDesk.anims.play('desk')
        this.createCounterText(600, 260, "MiniGameB"); // Position above the right box

        this.bottomDesk = this.physics.add.sprite(400,500, 'desk1');
        this.bottomDesk.anims.play('desk')
        this.createCounterText(400, 460, "MiniGameBalanceLaw"); // Position above the bottom box

        // Input setup
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create timer text
        this.timerText = this.add.text(400, 20, `Time: ${this.timeRemaining}`, {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);
    
        // Start the countdown
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Start the random incrementing
        this.startRandomIncrement();
    }

    createCounterText(x, y, minigame) {
        const text = this.add.text(x, y, minigameCounts[minigame], {
            fontSize: '24px',
            fill: '#fff',
        }).setOrigin(0.5);
        
        this.boxTextObjects[boxNames.indexOf(minigame)] = text; // Store the text object in the array
    }

    startRandomIncrement() {
        this.time.addEvent({
            delay: 3000, // 3 seconds
            callback: this.incrementRandomBox,
            callbackScope: this,
            loop: true
        });
    }
    
    incrementRandomBox() {
        if (isMinigameActive) return; // Don't increment if a mini-game is active
        const randomIndex = Phaser.Math.Between(0, 2); // Randomly select an index
        minigameCounts[boxNames[randomIndex]]++;
        
        // Update the corresponding text object
        this.boxTextObjects[randomIndex].setText(minigameCounts[boxNames[randomIndex]]);
    }

    updateTimer() {
        this.timeRemaining--;
        this.timerText.setText(`Time: ${this.timeRemaining}`);
        
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.timerText.setText(`Time: ${this.timeRemaining}`);
            // Optionally, trigger an event when the timer hits zero
            this.endGame();
        }
    }

    endGame() {
        // Stop the timer if needed
        // Transition to another scene or handle game logic here
        console.log("Time's up!"); // Placeholder for your game logic
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
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown;


        // flip that bitch!
        if (this.cursors.right.isDown) {
            this.player.scaleX = -1;
        } else if (this.cursors.left.isDown) {
            this.player.scaleX = 1;
        }

        if(isMoving ){
            // this shit needs to be done just once.
            if(!isWalking) {
                this.player.anims.play('laoban_walk');
                isWalking = true;
            }
        } else if (!isMoving) {
            // this also needs to be done just once.
            if(isWalking) {
                this.player.anims.play('laoban_stand');
                isWalking = false;
            }
            
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

        const collidingWithLeftDesk = Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.leftDesk.getBounds());
        const collidingWithRightDesk = Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.rightDesk.getBounds());
        const collidingWithBottomDesk = Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.bottomDesk.getBounds());
        const isAnythingCollidingWithAnything = collidingWithLeftDesk || collidingWithRightDesk || collidingWithBottomDesk;
    
        if (collidingWithLeftDesk){
            this.triggerMiniGame('MiniGameA')
        } else if (collidingWithRightDesk) {
            this.triggerMiniGame('MiniGameB')
        } else if (collidingWithBottomDesk) {
            this.triggerMiniGame('MiniGameBalanceLaw')
        } else if (!isAnythingCollidingWithAnything) {
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

            // Pause the timer
            this.timerEvent.paused = true;

            // Set the mini-game active flag
            isMinigameActive = true;

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
    name = "MiniGameA";
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

        // Resume the timer
        const mainScene = this.scene.get('MainScene');
        mainScene.timerEvent.paused = false;

        const scoreMessage = `MiniGame A ended! You pressed 'A' ${this.counter} times.`;
        console.log(scoreMessage);
	    justPlayedMinigame=true;
        isPlayingMinigame = false;
        isMinigameActive = false;

        // Reduce the corresponding box count
        if (minigameCounts[this.name] > 0) {
            minigameCounts[this.name]--; // Reduce the counter by one
            mainScene.boxTextObjects[boxNames.indexOf(this.name)].setText(minigameCounts[this.name]); // Update the displayed text
        }
    }
}

class MiniGameB extends Phaser.Scene {
    isPressed = false;
    name = "MiniGameB";
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

        // Resume the timer
        const mainScene = this.scene.get('MainScene');
        mainScene.timerEvent.paused = false;

        const scoreMessage = `MiniGame B ended! You pressed 'B' ${this.counter} times.`;
        console.log(scoreMessage);
        justPlayedMinigame = true;
        isPlayingMinigame = false;
        isMinigameActive = false;

        // Reduce the corresponding box count
        if (minigameCounts[this.name] > 0) {
            minigameCounts[this.name]--; // Reduce the counter by one
            mainScene.boxTextObjects[boxNames.indexOf(this.name)].setText(minigameCounts[this.name]); // Update the displayed text
        }
    }
}

let factor = 1.2;
let divider = 4;
let degrees = 0;
class MiniGameBalanceLaw extends Phaser.Scene {
    name = "MiniGameBalanceLaw";
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

        // Resume the timer
        const mainScene = this.scene.get('MainScene');
        mainScene.timerEvent.paused = false;

        const scoreMessage = `End balance is ${degrees}`;
        console.log(scoreMessage);
        justPlayedMinigame = true;
        isPlayingMinigame = false;
        isMinigameActive = false;

        // Reduce the corresponding box count
        if (minigameCounts[this.name] > 0) {
            minigameCounts[this.name]--; // Reduce the counter by one
            mainScene.boxTextObjects[boxNames.indexOf(this.name)].setText(minigameCounts[this.name]); // Update the displayed text
        }
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
