// @ts-check
import Beholder from "./Beholder";
import Wolf from "./Wolf";

class Knight extends Phaser.GameObjects.Sprite {
    keyLeft;
    keyRight;
    keyJump;
    keyFire;
    keySpecialFire;

    heroState = 'idle';
    animState;
    fireState = 'none';

    loaded = false;

    lastFire = 0;
    lastSpecialFire = 0;

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 171, height: 128 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(31, 50);
        this.body.setOffset(72, 59);
        this.body.setDragX(1100);
        this.body.setGravityY(700);
        this.body.setAllowGravity(false);

        this.scene.load.image('knight', 'assets/knight/knight.png');
        this.scene.load.spritesheet('knight-idle-spritesheet', 'assets/knight/idle.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-walk-spritesheet', 'assets/knight/walk.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-run-spritesheet', 'assets/knight/run.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-jump-spritesheet', 'assets/knight/jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-double-jump-spritesheet', 'assets/knight/double-jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-fall-spritesheet', 'assets/knight/fall.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-death-spritesheet', 'assets/knight/death.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-landing-spritesheet', 'assets/knight/landing.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-attack-spritesheet', 'assets/knight/attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-special-attack-spritesheet', 'assets/knight/special-attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-walk-attack-spritesheet', 'assets/knight/walk-attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-run-attack-spritesheet', 'assets/knight/run-attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-climb-spritesheet', 'assets/knight/climb.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('knight-earthattack-spritesheet', 'assets/knight/iceattack.png', { frameWidth: 34, frameHeight: 34 });

        this.scene.load.audio('knight-attack-sound', 'assets/knight/attack.mp3');
        this.scene.load.audio('knight-death-sound', 'assets/knight/death.mp3');
        this.scene.load.audio('knight-jump-sound', 'assets/knight/jump.mp3');
        this.scene.load.audio('knight-slash-sound', 'assets/knight/slash.mp3');
        this.scene.load.audio('knight-ice-cracking-sound', 'assets/knight/ice-cracking.mp3');

        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'knight-idle',
                frames: [
                    { frame: 0, key: 'knight', duration: 5000 },
                    ...this.scene.anims.generateFrameNumbers('knight-idle-spritesheet', {})
                ],
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'knight-walk',
                frames: this.scene.anims.generateFrameNumbers('knight-walk-spritesheet', {}),
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'knight-run',
                frames: this.scene.anims.generateFrameNumbers('knight-run-spritesheet', {}),
                frameRate: 6,
                repeat: -1,
            });

            this.scene.anims.create({
                key: 'knight-jump',
                frames: this.scene.anims.generateFrameNumbers('knight-jump-spritesheet', {}),
                frameRate: 6,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'knight-double-jump',
                frames: this.scene.anims.generateFrameNumbers('knight-double-jump-spritesheet', {}),
                frameRate: 20,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'knight-fall',
                frames: this.scene.anims.generateFrameNumbers('knight-fall-spritesheet', {}),
                frameRate: 10,//5
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-death',
                frames: this.scene.anims.generateFrameNumbers('knight-death-spritesheet', {}),
                frameRate: 10,//5
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-landing',
                frames: this.scene.anims.generateFrameNumbers('knight-landing-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-attack',
                frames: this.scene.anims.generateFrameNumbers('knight-attack-spritesheet', {}),
                frameRate: 25,//7
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-special-attack',
                frames: this.scene.anims.generateFrameNumbers('knight-special-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-walk-attack',
                frames: this.scene.anims.generateFrameNumbers('knight-walk-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-run-attack',
                frames: this.scene.anims.generateFrameNumbers('knight-run-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-earthattack',
                frames: this.scene.anims.generateFrameNumbers('knight-earthattack-spritesheet', {}),
                frameRate: 30,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'knight-climb',
                frames: this.scene.anims.generateFrameNumbers('knight-climb-spritesheet', {}),
                frameRate: 6,
                repeat: -1,
            });
            this.attackSound = this.scene.sound.add('knight-attack-sound', {
                loop: false,
                volume: 1
            });
            this.dathSound = this.scene.sound.add('knight-death-sound', {
                loop: false,
                volume: 1
            });
            this.jumpSound = this.scene.sound.add('knight-jump-sound', {
                loop: false,
                volume: 1
            });
            this.slashSound = this.scene.sound.add('knight-slash-sound', {
                loop: false,
                volume: 1
            });
            this.iceCrackingSound = this.scene.sound.add('knight-ice-cracking-sound', {
                loop: false,
                volume: 1
            });

            this.body.updateFromGameObject();

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);
            this.initialX = this.x;
            this.initialY = this.y;

            this.body.updateFromGameObject();
            this.body.setAllowGravity(true);

            this.loaded = true;

        }, this);

        this.scene.load.start();

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keySpecialFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
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

        if (this.heroState == 'dead') {
            return;
        }

        if (this.fireState == 'fire') {
            let enemies;
            if (this.flipX) {
                enemies = this.scene.physics.overlapRect(
                    this.body.left - 50,
                    this.body.top - 20,
                    50,
                    70
                );
            } else {
                enemies = this.scene.physics.overlapRect(
                    this.body.right,
                    this.body.top - 20,
                    50,
                    70
                );
            }

            for (let obj of enemies) {
                if (obj.gameObject instanceof Wolf || obj.gameObject instanceof Beholder) {
                    obj.gameObject.kill();
                }
            }

        }

        if (this.heroState != 'landing' && this.isOnFloor() && (this.heroState == 'double-jump' || this.heroState == 'fall')) {
            this.heroState = 'landing';
            this.fireState = 'none';
            this.animState = 'none';
            this.body.stop();
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyLeft.isUp && this.keyRight.isUp && this.isOnFloor()) {
            this.body.setAccelerationX(0);
            this.heroState = 'idle';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyLeft.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(200, 600);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'walk';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyRight.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(200, 600);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'walk';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyLeft.isDown && this.keyShift.isDown && this.isOnFloor()) {
            this.body.setMaxVelocity(400, 600);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'run';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyRight.isDown && this.keyShift.isDown && this.isOnFloor()) {
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

        if (this.fireState != 'special' && this.heroState != 'landing' && justDown && this.heroState != 'jump' && this.isOnFloor()) {
            this.body.setVelocityY(-400);
            justDown = false;
            this.heroState = 'jump';

            if (!this.keyRight.isDown && !this.keyLeft.isDown) {
                this.body.setVelocityX(0);
            }
        }

        if (this.fireState != 'special' && justDown && (this.heroState == 'jump' || this.heroState == 'fall')) {
            this.body.setVelocityY(-500);
            this.heroState = 'double-jump';
            if (!this.keyRight.isDown && !this.keyLeft.isDown) {
                this.body.setVelocityX(0);
            }
        }

        if (!this.body.onFloor() && !(this.heroState == 'jump' || this.heroState == 'double-jump') && this.body.velocity.y > 0 && this.heroState != 'fall') {
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

        if (this.fireState != 'fire' && this.heroState != 'landing' && this.fireState != 'special' && this.keyFire.isDown && Date.now() - this.lastFire > 800) {
            this.fireState = 'fire';
            this.lastFire = Date.now();
        }

        if (this.fireState != 'special' && this.fireState != 'fire' && this.isOnFloor() && this.heroState != 'landing' && this.keySpecialFire.isDown && Date.now() - this.lastSpecialFire > 6000) {
            this.fireState = 'special';
            this.lastSpecialFire = Date.now();
        }

        if (this.heroState == 'idle' && this.animState != 'idle' && this.fireState == 'none') {
            this.anims.play('knight-idle');
            this.animState = 'idle';

        }

        if (this.heroState == 'walk' && this.fireState == 'none' && this.animState != 'walk') {
            this.anims.play('knight-walk');
            this.animState = 'walk';
        }

        if (this.heroState == 'walk' && this.fireState == 'fire' && this.animState != 'walk-attack') {
            this.anims.play('knight-walk-attack');
            this.animState = 'walk-attack';
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                if (!this.keyFire.isDown) {
                    this.fireState = 'none';
                } else {
                    this.animState = 'enter-loop';
                }
            }, this);
        }

        if (this.heroState == 'run' && this.fireState == 'none' && this.animState != 'run') {
            this.animState = 'run';
            this.anims.play('knight-run');
        }

        if (this.heroState == 'run' && this.fireState == 'fire' && this.animState != 'run-attack') {
            this.animState = 'run-attack';
            this.anims.play('knight-run-attack');
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                if (!this.keyFire.isDown) {
                    this.fireState = 'none';
                } else {
                    this.animState = 'enter-loop';
                }
            }, this);
        }

        if (this.heroState == 'jump' && this.animState != 'jump' && this.fireState == 'none') {
            this.anims.play('knight-jump');
            this.animState = 'jump';
            this.jumpSound.play();
        }

        if (this.heroState == 'double-jump' && this.animState != 'double-jump' && this.fireState == 'none') {
            this.anims.play('knight-double-jump');
            this.animState = 'double-jump';
            this.jumpSound.play();
        }

        if (this.heroState == 'fall' && this.animState != 'fall' && this.fireState == 'none') {
            this.animState = 'fall';
            this.anims.play('knight-fall');
        }
        if (this.heroState == 'landing' && this.animState != 'landing') {
            this.animState = 'landing';
            this.anims.play('knight-landing');
            this.attackSound.play();
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                if (this.heroState != 'dead') {
                    this.heroState = 'idle';
                }
            })
        }
        if (this.fireState == 'fire' && this.animState != 'fire' && this.animState != 'run-attack' && this.animState != 'walk-attack') {
            this.animState = 'fire';
            this.anims.play('knight-attack');
            this.attackSound.play();
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.fireState = 'none';
            }, this);
            this.lastFire = Date.now();
        }

        if (this.fireState == 'special' && this.animState != 'special-fire') {
            this.animState = 'special-fire';
            this.anims.play('knight-special-attack');
            this.slashSound.play();
            this.body.stop();
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.fireState = 'none';
                this.scene.cameras.main.shake(1200, 0.002);
            }, this);
            this.lastFire = Date.now();
        }

        //console.log('heroState:' + this.heroState + ' animsState:' + this.animState + ' fireState:' + this.fireState);

    }

    onGroundColided(hero, tile) {
        if (tile.properties && tile.properties.tileType == 'ice') {
            this.body.setDragX(40);
            this.onIce = true;
        } else {
            this.body.setDragX(1100);
            this.onIce = false;
        }
    }

    onBackgroundOverlap(hero, tile) {
        if (tile.properties.tileType == 'checkpoint') {
            let newX = tile.pixelX - this.body.offset.x - this.body.halfWidth;
            if (this.initialX < tile.pixelX && newX - this.initialX > 32 * 3) {
                let text = this.scene.add.text(tile.pixelX, -50, 'CHECK POINT');
                text.setColor('#1900ff');
                text.setFontSize(22);
                text.setStroke('#ffffff', 4);
                text.setFontFamily('Stick');
                text.setFontStyle('bold');
                text.setOrigin(0.5, 1);
                let tweenConfig = {
                    targets: text,
                    y: tile.pixelY,
                    duration: 5000,
                    ease: 'Elastic',
                    easeParams: [0.01, 0.8],
                    yoyo: true,
                    hold: 2500,
                    repeat: 0,
                    onComplete: () => {
                        text.destroy();
                    },
                    onCompleteScope: this
                };
                this.scene.tweens.add(tweenConfig);
                this.initialX = newX;
                this.initialY = tile.pixelY + this.height - this.body.offset.y - this.body.height;
            }
        }
    }

    kill() {
        if (this.heroState != 'dead') {
            this.animState = 'dead';
            this.heroState = 'dead';
            this.fireState = 'none';
            this.anims.play('knight-death');
            this.body.stop();
            this.dathSound.play();
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.setX(this.initialX);
                this.setY(this.initialY);
                this.body.updateFromGameObject();
                this.heroState = 'idle';
            }, this);
        }
    }
}

export default Knight;