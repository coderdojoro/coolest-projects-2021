// @ts-check

class Rogue extends Phaser.GameObjects.Sprite {

    keyLeft;
    keyRight;
    keyJump;
    keyFire;
    keySpecialFire;

    waterGroup;

    heroState = 'fall';
    animState = 'fall';
    fireState = "none";

    lastFire = 0;
    lastSpecialFire = 0;

    constructor(scene, x, y, waterGroup) {
        super(scene, x, y, scene.make.renderTexture({ width: 171, height: 128 }).texture);
        this.waterGroup = waterGroup;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene.load.image('hero', 'assets/rogue/rogue.png');
        this.scene.load.spritesheet('idle-spritesheet', 'assets/rogue/idle.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('walk-spritesheet', 'assets/rogue/walk.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('run-spritesheet', 'assets/rogue/run.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('jump-spritesheet', 'assets/rogue/jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('double-jump-spritesheet', 'assets/rogue/double-jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('fall-spritesheet', 'assets/rogue/fall.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('death-spritesheet', 'assets/rogue/death.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('landing-spritesheet', `assets/rogue/landing.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('attack-spritesheet', `assets/rogue/attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('special-attack-spritesheet', `assets/rogue/special-attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('walk-attack-spritesheet', `assets/rogue/walk-attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('run-attack-spritesheet', `assets/rogue/run-attack.png`, { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('slash-spritesheet', `assets/rogue/slash.png`, { frameWidth: 169, frameHeight: 61 });

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'hero-idle',
                frames: [
                    { frame: 0, key: 'hero', duration: 5000 },
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
            this.scene.anims.create({
                key: 'slash',
                frames: this.scene.anims.generateFrameNumbers('slash-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);
            this.initialX = this.x;
            this.initialY = this.y;

            this.body.updateFromGameObject();
            this.body.setAllowGravity(true);

            this.loaded = true;

        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(30, 54);
        this.body.setOffset(70, 57);
        this.body.setDragX(1100);
        this.body.setGravityY(300);
        this.body.setAllowGravity(false);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keySpecialFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    }

    isOnFloor() {
        let onGround = this.body.onFloor() && this.body.velocity.y == 0;
        if (onGround) {
            return true;
        }
        //in water
        return this.isInWater();
    }

    isInWater() {
        let waters = this.waterGroup.getChildren();
        let overlapsWater = false;
        for (let whater of waters) {
            overlapsWater = this.scene.physics.overlapRect(
                whater.x,
                whater.y - 32,
                32,
                32)
                .includes(this.body);
            if (overlapsWater) {
                break;
            }
        }
        let touchWhaterBody = this.body.touching.down;
        return overlapsWater && touchWhaterBody;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        if (this.isInWater()) {
            this.body.setDragX(5500);
        } else {
            this.body.setDragX(500);
        }

        if (this.heroState != 'landing' && this.heroState != "dead" && this.isOnFloor() && (this.heroState == 'double-jump' || this.heroState == 'fall')) {
            this.heroState = 'landing';
            this.body.stop();
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isUp && this.keyRight.isUp && this.isOnFloor()) {
            this.body.setAccelerationX(0);
            this.heroState = 'idle';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(40, 400);
                this.body.setAccelerationX(-150);
            } else {
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'walk';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyRight.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(40, 400);
                this.body.setAccelerationX(150);
            } else {
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = "walk";
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isDown && this.keyShift.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(80, 400);
                this.body.setAccelerationX(-200);
            } else {
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'run';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyRight.isDown && this.keyShift.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(80, 400);
                this.body.setAccelerationX(200);
            } else {
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'run';
        }

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump);

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && justDown && this.heroState != 'jump' && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setVelocityY(-170);
            } else {
                this.body.setVelocityY(-250);
            }
            justDown = false;
            this.heroState = 'jump';

            if (!this.keyRight.isDown && !this.keyLeft.isDown) {
                this.body.setVelocityX(0);
            }
        }

        if (this.fireState != 'special' && this.heroState != "dead" && justDown && (this.heroState == 'jump' || this.heroState == 'fall')) {
            this.body.setVelocityY(-400);
            this.heroState = 'double-jump';
            //nu mai e în apă la double jump
            this.body.setMaxVelocity(200, 400);
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

        if (this.fireState != 'fire' && this.heroState != 'landing' && this.fireState != 'special' && this.heroState != "dead" && this.keyFire.isDown && Date.now() - this.lastFire > 800) {
            this.fireState = 'fire';
            this.lastFire = Date.now();
        }

        if (this.fireState != 'special' && this.fireState != 'fire' && this.isOnFloor() && this.heroState != 'landing' && this.heroState != "dead" && this.keySpecialFire.isDown && Date.now() - this.lastSpecialFire > 600) {
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
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
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
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
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
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle';
            })
        }
        if (this.fireState == 'fire' && this.animState != 'fire' && this.animState != 'run-attack' && this.animState != 'walk-attack') {
            this.animState = 'fire';
            this.anims.play('hero-attack');
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.fireState = 'none';
            }, this);
            this.lastFire = Date.now();
        }

        if (this.fireState == 'special' && this.animState != 'special-fire') {
            this.animState = 'special-fire';

            this.scene.time.delayedCall(350, () => {
                this.anims.play('hero-special-attack');
                this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.setTexture('hero');
                }, this);
            }, null, this);

            const tweenConfig = {
                targets: this.scene.cameras.main,
                zoom: 2.0,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: true,
                hold: 1400,
                repeat: 0,
                onComplete: () => {
                    this.fireState = 'none';
                    this.heroState = 'idle';
                    this.animState = 'idle';
                    this.anims.play('hero-idle');
                },
                onCompleteScope: this
            }
            this.scene.tweens.add(tweenConfig);

            this.body.stop();
            this.lastSpecialFire = Date.now();
        }

        // console.log('heroState:' + this.heroState + ' animsState:' + this.animState + " fireState:" + this.fireState);

    }

    kill() {
        if (this.heroState != "dead") {
            this.animState = "dead";
            this.heroState = "dead";
            this.fireState = 'none';
            this.anims.play('hero-death');
            this.body.stop();
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.setX(this.initialX);
                this.setY(this.initialY);
                this.body.updateFromGameObject();
                this.heroState = 'idle';
            }, this);
        }
    }

}

export default Rogue;