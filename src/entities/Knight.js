// @ts-check
class Knight extends Phaser.GameObjects.Sprite {
    keyLeft;
    keyRight;
    keyJump;
    keyFire;
    keySpecialFire;

    heroState = 'fall';
    animState;
    fireState = "none";

    loaded = false;

    lastFire = 0;
    lastSpecialFire = 0;

    constructor(scene, x, y) {
        super(scene, x, y, 'empty');
        this.initialX = x;
        this.initialY = y;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.loadAssets();

        this.body.setCollideWorldBounds(true);
        this.body.setSize(31, 50);
        this.body.setOffset(72, 59);
        this.body.setDragX(1100);
        this.body.setGravityY(700);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keySpecialFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    }

    loadAssets() {
        this.scene.load.image('hero', 'assets/knight/knight.png');
        this.scene.load.spritesheet('idle-spritesheet', 'assets/knight/idle.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('walk-spritesheet', 'assets/knight/walk.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('run-spritesheet', 'assets/knight/run.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('jump-spritesheet', 'assets/knight/jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('double-jump-spritesheet', 'assets/knight/double-jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('fall-spritesheet', 'assets/knight/fall.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('death-spritesheet', 'assets/knight/death.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('landing-spritesheet', `assets/knight/landing.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('attack-spritesheet', `assets/knight/attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('special-attack-spritesheet', `assets/knight/special-attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('walk-attack-spritesheet', `assets/knight/walk-attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('run-attack-spritesheet', `assets/knight/run-attack.png`, { frameWidth: 171, frameHeight: 128 });

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            console.log("LOAD COMPLETE");
            this.scene.anims.create({
                key: 'hero-idle',
                frames: [
                    { frame: 0, key: 'hero', duration: 10000 },
                    ...this.scene.anims.generateFrameNumbers('idle-spritesheet', {})
                ],
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'hero-walk',
                frames: this.scene.anims.generateFrameNumbers('walk-spritesheet', {}),
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'hero-run',
                frames: this.scene.anims.generateFrameNumbers('run-spritesheet', {}),
                frameRate: 6,
                repeat: -1,
            });

            this.scene.anims.create({
                key: 'hero-jump',
                frames: this.scene.anims.generateFrameNumbers('jump-spritesheet', {}),
                frameRate: 6,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'hero-double-jump',
                frames: this.scene.anims.generateFrameNumbers('double-jump-spritesheet', {}),
                frameRate: 20,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'hero-fall',
                frames: this.scene.anims.generateFrameNumbers('fall-spritesheet', {}),
                frameRate: 10,//5
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'hero-death',
                frames: this.scene.anims.generateFrameNumbers('death-spritesheet', {}),
                frameRate: 10,//5
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'hero-landing',
                frames: this.scene.anims.generateFrameNumbers('landing-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'hero-attack',
                frames: this.scene.anims.generateFrameNumbers('attack-spritesheet', {}),
                frameRate: 10,//7
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'hero-special-attack',
                frames: this.scene.anims.generateFrameNumbers('special-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'hero-walk-attack',
                frames: this.scene.anims.generateFrameNumbers('walk-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'hero-run-attack',
                frames: this.scene.anims.generateFrameNumbers('run-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });

            this.loaded = true;

        }, this);

        this.scene.load.start();
    }

    isOnFloor() {
        let onGround = this.body.onFloor() && this.body.velocity.y == 0;
        return onGround;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.loaded) {
            return;
        }

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        if (this.heroState != 'landing' && this.heroState != "dead" && this.isOnFloor() && (this.heroState == 'double-jump' || this.heroState == 'fall')) {
            this.heroState = 'landing';
            this.body.setVelocityX(0);
            this.body.setAcceleration(0);
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isUp && this.keyRight.isUp && this.isOnFloor()) {
            this.body.setAccelerationX(0);
            this.heroState = 'idle';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(200, 600);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'walk';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyRight.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(200, 600);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = "walk";
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isDown && this.keyShift.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(400, 600);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'run';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyRight.isDown && this.keyShift.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(400, 600);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'run';
        }

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump);

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && justDown && this.heroState != 'jump' && this.isOnFloor()) {
            this.body.setVelocityY(-400);
            justDown = false;
            this.heroState = 'jump';

            if (!this.keyRight.isDown && !this.keyLeft.isDown) {
                this.body.setVelocityX(0);
            }
        }

        if (this.fireState != 'special' && this.heroState != "dead" && justDown && (this.heroState == 'jump' || this.heroState == 'fall')) {
            this.body.setVelocityY(-500);
            this.heroState = 'double-jump';
            if (!this.keyRight.isDown && !this.keyLeft.isDown) {
                this.body.setVelocityX(0);
            }
        }

        if (this.heroState != "dead" && !this.body.onFloor() && !(this.heroState == 'jump' || this.heroState == 'double-jump') && this.body.velocity.y > 0 && this.heroState != 'fall') {
            this.heroState = 'fall';
            this.body.setVelocityX(0);
        }

        if (this.heroState == 'jump' || this.heroState == 'double-jump' || this.heroState == 'fall') {
            if (this.keyRight.isDown) {
                this.setFlipX(false);
                this.body.setAccelerationX(500);
            } else if (this.keyLeft.isDown) {
                this.setFlipX(true);
                this.body.setAccelerationX(-500);
            } else {
                this.body.setVelocityX(0);
            }
        }

        if (this.fireState != 'fire' && this.heroState != 'landing' && this.fireState != 'special' && this.heroState != "dead" && this.keyFire.isDown && Date.now() - this.lastFire > 600) {
            this.fireState = 'fire';
            this.lastFire = Date.now();
        }

        if (this.fireState != 'special' && this.fireState != 'fire' && this.isOnFloor() && this.heroState != 'landing' && this.heroState != "dead" && this.keySpecialFire.isDown && Date.now() - this.lastSpecialFire > 5000) {
            this.fireState = 'special';
            this.lastSpecialFire = Date.now();
        }

        if (this.heroState == "idle" && this.animState != 'idle' && this.fireState == 'none') {
            this.anims.play('hero-idle');
            this.animState = 'idle';

        }

        if (this.heroState == "walk" && this.fireState == 'none' && this.animState != "walk") {
            this.anims.play('hero-walk');
            this.animState = "walk";
        }

        if (this.heroState == "walk" && this.fireState == 'fire' && this.animState != "walk-attack") {
            this.anims.play("hero-walk-attack");
            this.animState = "walk-attack";
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                if (!this.keyFire.isDown) {
                    this.fireState = 'none';
                } else {
                    this.animState = "enter-loop";
                }
            }, this);
        }

        if (this.heroState == 'run' && this.fireState == 'none' && this.animState != 'run') {
            this.animState = 'run';
            this.anims.play('hero-run');
        }

        if (this.heroState == 'run' && this.fireState == 'fire' && this.animState != 'run-attack') {
            this.animState = 'run-attack';
            this.anims.play('hero-run-attack');
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                if (!this.keyFire.isDown) {
                    this.fireState = 'none';
                } else {
                    this.animState = "enter-loop";
                }
            }, this);
        }

        if (this.heroState == 'jump' && this.animState != 'jump' && this.fireState == 'none') {
            this.anims.play('hero-jump');
            this.animState = 'jump';
        }

        if (this.heroState == 'double-jump' && this.animState != 'double-jump' && this.fireState == 'none') {
            this.anims.play('hero-double-jump');
            this.animState = 'double-jump';
        }

        if (this.heroState == 'fall' && this.animState != 'fall' && this.fireState == 'none') {
            this.animState = 'fall';
            this.anims.play('hero-fall');
        }
        if (this.heroState == 'landing' && this.animState != 'landing') {
            this.animState = 'landing';
            this.anims.play('hero-landing');
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.heroState = 'idle';
            })
        }
        if (this.fireState == 'fire' && this.animState != 'fire' && this.animState != 'run-attack' && this.animState != 'walk-attack') {
            this.animState = 'fire';
            this.anims.play('hero-attack');
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.fireState = 'none';
            }, this);
            this.lastFire = Date.now();
        }

        if (this.fireState == 'special' && this.animState != 'special-fire') {
            this.animState = 'special-fire';
            this.anims.play('hero-special-attack');
            this.body.setVelocityX(0);
            this.body.setAcceleration(0);
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.fireState = 'none';
                this.scene.cameras.main.shake(800, 0.002);
            }, this);
            this.lastFire = Date.now();
        }

        // console.log('heroState:' + this.heroState + ' animsState:' + this.animState + " fireState:" + this.fireState);

    }

    groundColided(hero, tile) {
        if (tile.properties && tile.properties.tileType == 'ice') {
            this.body.setDragX(40);
            this.onIce = true;
        } else {
            this.body.setDragX(1100);
            this.onIce = false;
        }
    }

    backgroundOverlap(hero, tile) {
        if (tile.properties.tileType == 'checkpoint') {
            if (this.initialX < tile.pixelX) {
                this.initialX = tile.pixelX;
                this.initialY = tile.pixelY;
            }
        }
    }

    onAnimationComplete() {
        this.heroState = 'idle';
        this.animState = 'idle';
        this.setX(this.initialX);
        this.setY(this.initialY);
    }

    kill() {
        if (this.heroState != "dead") {
            this.animState = "dead";
            this.heroState = "dead";
            this.fireState = 'none';
            this.anims.play('hero-death');
            this.body.setVelocity(0, 0);
            this.body.setAcceleration(0);
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.onAnimationComplete, this);
        }
    }

}

export default Knight;