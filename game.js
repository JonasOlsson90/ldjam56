let booted = true;
let splash;
let framerate = 6;
let isWalking = false;
let isMinigameActive = false;
let minigameCounts = {MiniGameA: 1, MiniGameB: 1, MiniGameBalanceLaw: 1};
let minigameStrikes = {MiniGameA: 0, MiniGameB: 0, MiniGameBalanceLaw: 0};
let boxNames = ["MiniGameA", "MiniGameB", "MiniGameBalanceLaw"];
let delay = 3000;
let releaseCounter = 0;
    
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.timeRemaining = 30; // Countdown from 30 seconds
        this.timerText = null; // To hold the text object
        this.timerEvent = null; // To hold the timer event
        this.boxTextObjects = []; // To hold text objects above boxes
    }

    preload() {
        this.load.image('player', 'assets/box.png'); // Replace with actual path

        this.load.image('office', 'assets/office.png');
        this.load.image('minigame_splash', 'assets/minigame_splash.png');
        this.load.image('splash', 'assets/splash.png');
        this.load.image('lawsuit', 'assets/button.png');
        
        this.load.image('laoban_stand1', 'assets/laoban_stand1.png');
        this.load.image('laoban_stand2', 'assets/laoban_stand2.png');
        this.load.image('laoban_walk1', 'assets/laoban_walk1.png');
        this.load.image('laoban_walk2', 'assets/laoban_walk2.png');
        this.load.image('laoban_whip0', 'assets/laoban_whip0.png');
        this.load.image('laoban_whip1', 'assets/laoban_whip1.png');
        this.load.image('laoban_whip2', 'assets/laoban_whip2.png');
        this.load.image('laoban_whip3', 'assets/laoban_whip3.png');
        this.load.image('laoban_whip4', 'assets/laoban_whip4.png');
        this.load.image('laoban_balance', 'assets/laoban_balance.png');
        this.load.image('laoban_tipping', 'assets/laoban_tipping.png');
        this.load.image('laoban_falling', 'assets/laoban_falling.png');
        this.load.image('laoban_sue1', 'assets/laoban_sue1.png');
        this.load.image('laoban_sue2', 'assets/laoban_sue2.png');
        this.load.image('laoban_throw1', 'assets/laoban_throw1.png');
        this.load.image('laoban_throw2', 'assets/laoban_throw2.png');
        this.load.image('laoban_throw3', 'assets/laoban_throw3.png');


        this.load.image('balance_top', 'assets/balance_top.png');


        this.load.image('desk1', 'assets/desk1.png');
        this.load.image('desk2', 'assets/desk2.png');

        this.load.image('dev1', 'assets/dev1.png');
        this.load.image('dev2', 'assets/dev2.png');


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

        this.startReleaseCountdown();

        // Start the random incrementing
        this.startRandomIncrement();
    }

    startReleaseCountdown() {
        if (releaseCounter > 0) {
            console.log(`TinyCreatures ${releaseCounter} was released!`);
            this.timeRemaining = 30;
            this.timerText.setText(`Time: ${this.timeRemaining}`);
        } else {
            // Start the countdown
            this.timerEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        }

        releaseCounter++;
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
            delay: delay,
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
            this.startReleaseCountdown();
        }
    }

    gameOver() {
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

        if (Object.values(minigameStrikes).some(value => value > 2)) {
            console.log("You lost!");
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
                justPlayedMinigame = false;
            }
        }
    }

    triggerMiniGame(miniGame) {
        // console.log("isMinigamePlayable: " + isMinigamePlayable);
        if (minigameCounts[miniGame] <= 0) return;
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

        const bg = this.add.image(0, 0, "minigame_splash");
        bg.setOrigin(0,0);
        this.counter = 0;
        this.topText = this.add.text(400, 100, 'CRUNCH TIME!', {fontSize: '32px',fill: '#fff',}).setOrigin(0.5);
        this.bottomText = this.add.text(400, 500, 'Mash A to motivate workers!', {fontSize: '32px',fill: '#fff',}).setOrigin(0.5);

        this.anims.create({
            key: 'dev',
            frames: [{key: 'dev1'}, {key: 'dev2'}],
            frameRate: framerate,
            repeat: -1
        })

        this.anims.create({
            key: 'laoban_whip_anim',
            frames: [{key: 'laoban_whip0'}, {key: 'laoban_whip1'}, {key: 'laoban_whip2'},{key: 'laoban_whip3'},{key: 'laoban_whip4'}],
            frameRate: framerate*4,
            repeat: 0
        })
        this.dev = this.physics.add.sprite(500,300, 'desk1');
        this.dev.anims.play('dev')
        this.dev.scale = 2;
        this.laoban_whip = this.physics.add.sprite(350,250, 'laoban_whip4');
        this.laoban_whip.scale = 2;

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
            this.laoban_whip.anims.play('laoban_whip_anim')
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
        if (this.counter < 10) {
            minigameStrikes[this.name]++;
        }
	    justPlayedMinigame=true;
        isPlayingMinigame = false;
        isMinigameActive = false;

        // Reduce the corresponding box count
        if (minigameCounts[this.name] > 0 && this.counter >= 10) {
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
        this.player = null;
        this.lawsuits = null; // Group to hold lawsuits
    }

    create() {
        const image1 = this.add.image(0, 0, "minigame_splash");
        image1.setOrigin(0,0);


        this.topText = this.add.text(400, 100, 'STOP THE MEAN VIDEOS!', {fontSize: '32px',fill: '#fff',}).setOrigin(0.5);
        this.bottomText = this.add.text(400, 500, 'Press SPACE to Copyright Claim', {fontSize: '32px',fill: '#fff',}).setOrigin(0.5);



        // Set up the player
        this.laoban_sue = this.physics.add.sprite(100, 300, 'laoban_sue1'); // Replace 'dev1' with your player sprite
        this.laoban_sue.setCollideWorldBounds(true);
        //this.player.scaleX = -1;


        this.anims.create({
            key: 'laoban_sue',
            frames: [{key: 'laoban_sue1'}, {key: 'laoban_sue2'}],
            frameRate: framerate,
            repeat: -1
        })

        this.anims.create({
            key: 'laoban_throw',
            frames: [{key: 'laoban_throw1'}, {key: 'laoban_throw2'}, {key: 'laoban_throw3'}, {key: 'laoban_sue1'}],
            frameRate: framerate * 4,
            repeat: 0
        })



        // Create a group for lawsuits
        this.lawsuits = this.physics.add.group({
            defaultKey: 'lawsuit', // You need to load this lawsuit sprite in preload
            maxSize: 10 // Limit the number of lawsuits on screen
        });
        
        // Add keyboard input listeners
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', this.sue, this);
        
        // Set a timer to end the mini-game
        this.time.delayedCall(10000, this.endMiniGame, [], this); // 3 seconds for the mini-game duration

        isPlayingMinigame = true;
    }

    update() {
        // Move the player up and down
        if (this.cursors.up.isDown) {
            this.laoban_sue.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.laoban_sue.setVelocityY(200);
        } else {
            this.laoban_sue.setVelocityY(0);
        }

        // Update lawsuits
        this.lawsuits.children.iterate(lawsuit => {
            if (lawsuit) {
                lawsuit.setVelocityX(400); // Set lawsuit speed
            }
        });
    }

    sue() {
        // Get the first available lawsuit from the group
        const lawsuit = this.lawsuits.get();

        if (lawsuit) {
            this.laoban_sue.anims.play('laoban_throw')

            // Set lawsuit position to the player's position and reset its velocity
            lawsuit.setPosition(this.laoban_sue.x + 20, this.laoban_sue.y);
            lawsuit.setActive(true);
            lawsuit.setVisible(true);
            lawsuit.body.velocity.x = 400; // Lawsuit speed to the right

            // Optionally, you can set a timeout to deactivate the lawsuit after a certain time
            this.time.delayedCall(2000, () => {
                lawsuit.setActive(false);
                lawsuit.setVisible(false);
            });
        }
    }

    endMiniGame() {
        this.input.keyboard.off('keydown-SPACE', this.shoot, this);
        this.scene.stop();
        this.scene.resume('MainScene');

        // Resume the timer
        const mainScene = this.scene.get('MainScene');
        mainScene.timerEvent.paused = false;

        console.log("MiniGame B ended!");
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

        const bg = this.add.image(0, 0, "minigame_splash");
        bg.setOrigin(0,0);

        
        if (Math.floor(Math.random() * 10) % 2 === 0){
            this.counter = 1;
        } else {
            this.counter = -1;
        }

        this.anims.create({
            key: 'balance',
            frames: [{key: 'laoban_balance'}],
            frameRate: framerate,
            repeat: 0
        })

        this.anims.create({
            key: 'falling',
            frames: [{key: 'laoban_falling'}],
            frameRate: framerate,
            repeat: 0
        })

        this.anims.create({
            key: 'tipping',
            frames: [{key: 'laoban_tipping'}],
            frameRate: framerate,
            repeat: 0
        })

        this.balance_top = this.physics.add.sprite(400,300, 'balance_top');
        this.balance_top.scale = 2;
        this.laoban_balance = this.physics.add.sprite(400,300, 'laoban_balance');


        this.laoban_balance.scale = 2;
        this.laoban_balance.setOrigin(0.5, 0.5);
        this.laoban_balance.body.allowRotation = true;

        this.topText = this.add.text(400, 100, 'COMPETITORS ARE CATCHING UP!', {fontSize: '32px',fill: '#fff',}).setOrigin(0.5);
        this.bottomText = this.add.text(400, 500, 'Use ARROW KEYS to balance your lawsuit!', {fontSize: '32px',fill: '#fff',}).setOrigin(0.5);



        this.input.keyboard.on('keydown-RIGHT', this.incrementCounter, this);
        this.input.keyboard.on('keydown-LEFT', this.decrementCounter, this);
        this.time.delayedCall(15000, this.endMiniGame, [], this);
	    isPlayingMinigame=true;
        this.lost = false;
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

        degrees = this.counter / divider;
        console.log(degrees);
        
        this.laoban_balance.anims.play('balance')

        if (degrees > 15 || degrees < -15) {
            this.laoban_balance.anims.play('tipping')
        } 

        if (degrees > 30 || degrees < -30) {
            this.laoban_balance.anims.play('falling')
        }

        if (degrees > 50 || degrees < -50) {
            minigameStrikes[this.name]++;
            this.lost = true;
            this.endMiniGame();
        }

        this.laoban_balance.rotation = degrees * (Math.PI / 180);
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
        if (minigameCounts[this.name] > 0 && !this.lost) {
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
this.lostthis.lost