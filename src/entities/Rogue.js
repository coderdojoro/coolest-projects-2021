// @ts-check

import Ent from "./Ent";
import Spider from "./Spider";

class Rogue extends Phaser.GameObjects.Sprite {

    keyLeft;
    keyRight;
    keyJump;
    keyFire;
    keySpecialFire;

    waterGroup;

    heroState = 'idle';
    animState;
    fireState = 'none';

    loaded = false;

    lastFire = 0;
    lastSpecialFire = 0;

    constructor(scene, x, y, waterGroup) {
        super(scene, x, y, scene.make.renderTexture({ width: 171, height: 128 }).texture);
        this.waterGroup = waterGroup;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(30, 54);
        this.body.setOffset(70, 57);
        this.body.setDragX(1100);
        this.body.setGravityY(300);
        this.body.setAllowGravity(false);

        this.scene.load.image('rogue', 'assets/rogue/rogue.png');
        this.scene.load.spritesheet('rogue-idle-spritesheet', 'assets/rogue/idle.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-walk-spritesheet', 'assets/rogue/walk.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-run-spritesheet', 'assets/rogue/run.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-jump-spritesheet', 'assets/rogue/jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-double-jump-spritesheet', 'assets/rogue/double-jump.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-fall-spritesheet', 'assets/rogue/fall.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-death-spritesheet', 'assets/rogue/death.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-landing-spritesheet', 'assets/rogue/landing.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-attack-spritesheet', 'assets/rogue/attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-special-attack-spritesheet', 'assets/rogue/special-attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-walk-attack-spritesheet', 'assets/rogue/walk-attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-run-attack-spritesheet', 'assets/rogue/run-attack.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-climb-spritesheet', 'assets/rogue/climb.png', { frameWidth: 171, frameHeight: 128 });
        this.scene.load.spritesheet('rogue-slash-spritesheet', 'assets/rogue/slash.png', { frameWidth: 169, frameHeight: 61 });

        this.scene.load.audio('rogue-attack-sound', 'assets/rogue/attack.mp3');
        this.scene.load.audio('rogue-death-sound', 'assets/rogue/death.mp3');
        this.scene.load.audio('rogue-jump-sound', 'assets/rogue/jump.mp3');
        this.scene.load.audio('rogue-slash-sound', 'assets/rogue/slash.mp3');

        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'rogue-idle',
                frames: [
                    { frame: 0, key: 'rogue', duration: 5000 },
                    ...this.scene.anims.generateFrameNumbers('rogue-idle-spritesheet', {})
                ],
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'rogue-walk',
                frames: this.scene.anims.generateFrameNumbers('rogue-walk-spritesheet', {}),
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'rogue-run',
                frames: this.scene.anims.generateFrameNumbers('rogue-run-spritesheet', {}),
                frameRate: 6,
                repeat: -1,
            });

            this.scene.anims.create({
                key: 'rogue-jump',
                frames: this.scene.anims.generateFrameNumbers('rogue-jump-spritesheet', {}),
                frameRate: 6,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'rogue-double-jump',
                frames: this.scene.anims.generateFrameNumbers('rogue-double-jump-spritesheet', {}),
                frameRate: 20,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'rogue-fall',
                frames: this.scene.anims.generateFrameNumbers('rogue-fall-spritesheet', {}),
                frameRate: 10,//5
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-death',
                frames: this.scene.anims.generateFrameNumbers('rogue-death-spritesheet', {}),
                frameRate: 10,//5
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-landing',
                frames: this.scene.anims.generateFrameNumbers('rogue-landing-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-attack',
                frames: this.scene.anims.generateFrameNumbers('rogue-attack-spritesheet', {}),
                frameRate: 10,//7
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-special-attack',
                frames: this.scene.anims.generateFrameNumbers('rogue-special-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-walk-attack',
                frames: this.scene.anims.generateFrameNumbers('rogue-walk-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-run-attack',
                frames: this.scene.anims.generateFrameNumbers('rogue-run-attack-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-slash',
                frames: this.scene.anims.generateFrameNumbers('rogue-slash-spritesheet', {}),
                frameRate: 10,
                repeat: 0,
            });
            this.scene.anims.create({
                key: 'rogue-climb',
                frames: this.scene.anims.generateFrameNumbers('rogue-climb-spritesheet', {}),
                frameRate: 6,
                repeat: -1,
            });
            this.attackSound = this.scene.sound.add('rogue-attack-sound', {
                loop: false,
                volume: 1
            });
            this.dathSound = this.scene.sound.add('rogue-death-sound', {
                loop: false,
                volume: 1
            });
            this.jumpSound = this.scene.sound.add('rogue-jump-sound', {
                loop: false,
                volume: 1
            });
            this.slashSound = this.scene.sound.add('rogue-slash-sound', {
                loop: false,
                volume: 1
            });

            this.body.updateFromGameObject();

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);
            this.initialX = this.x;
            this.initialY = this.y;

            this.finishX = finishX - (this.body.offset.x);
            this.finishY = finishY + (this.height - this.body.offset.y - this.body.height);

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
                    this.body.left - 25,
                    this.body.top,
                    25,
                    54
                );
            } else {
                enemies = this.scene.physics.overlapRect(
                    this.body.right,
                    this.body.top,
                    25,
                    54
                );
            }

            for (let obj of enemies) {
                if (obj.gameObject instanceof Ent || obj.gameObject instanceof Spider) {
                    obj.gameObject.kill();
                }
            }
        }

        if (this.isInWater()) {
            this.body.setDragX(5500);
        } else {
            this.body.setDragX(500);
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

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyRight.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(40, 400);
                this.body.setAccelerationX(150);
            } else {
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'walk';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyLeft.isDown && this.keyShift.isDown && this.isOnFloor()) {
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

        if (this.fireState != 'special' && this.heroState != 'landing' && this.keyRight.isDown && this.keyShift.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(80, 400);
                this.body.setAccelerationX(200);
            } else {
                this.body.setMaxVelocity(800, 1200);
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'run';
        }

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump);

        if (this.fireState != 'special' && this.heroState != 'landing' && justDown && this.heroState != 'jump' && this.isOnFloor()) {
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

        if (this.fireState != 'special' && justDown && (this.heroState == 'jump' || this.heroState == 'fall')) {
            this.body.setVelocityY(-400);
            this.heroState = 'double-jump';
            //nu mai e în apă la double jump
            this.body.setMaxVelocity(200, 400);
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

        if (this.fireState != 'special' && this.fireState != 'fire' && this.isOnFloor() && this.heroState != 'landing' && this.keySpecialFire.isDown && Date.now() - this.lastSpecialFire > 5000) {
            this.fireState = 'special';
            this.lastSpecialFire = Date.now();
        }

        if (this.heroState == 'idle' && this.animState != 'idle' && this.fireState == 'none') {
            this.anims.play('rogue-idle');
            this.animState = 'idle';

        }

        if (this.heroState == 'walk' && this.fireState == 'none' && this.animState != 'walk') {
            this.anims.play('rogue-walk');
            this.animState = 'walk';
        }

        if (this.heroState == 'walk' && this.fireState == 'fire' && this.animState != 'walk-attack') {
            this.anims.play('rogue-walk-attack');
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
            this.anims.play('rogue-run');
        }

        if (this.heroState == 'run' && this.fireState == 'fire' && this.animState != 'run-attack') {
            this.animState = 'run-attack';
            this.anims.play('rogue-run-attack');
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                if (!this.keyFire.isDown) {
                    this.fireState = 'none';
                } else {
                    this.animState = 'enter-loop';
                }
            }, this);
        }

        if (this.heroState == 'jump' && this.animState != 'jump' && this.fireState == 'none') {
            this.anims.play('rogue-jump');
            this.animState = 'jump';
            this.jumpSound.play();
        }

        if (this.heroState == 'double-jump' && this.animState != 'double-jump' && this.fireState == 'none') {
            this.anims.play('rogue-double-jump');
            this.animState = 'double-jump';
            this.jumpSound.play();
        }

        if (this.heroState == 'fall' && this.animState != 'fall' && this.fireState == 'none') {
            this.animState = 'fall';
            this.anims.play('rogue-fall');
        }
        if (this.heroState == 'landing' && this.animState != 'landing') {
            this.animState = 'landing';
            this.anims.play('rogue-landing');
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                if (this.heroState != 'dead') {
                    this.heroState = 'idle';
                }
            })
        }
        if (this.fireState == 'fire' && this.animState != 'fire' && this.animState != 'run-attack' && this.animState != 'walk-attack') {
            this.animState = 'fire';
            this.anims.play('rogue-attack');
            this.attackSound.play();
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.fireState = 'none';
            }, this);
            this.lastFire = Date.now();
        }

        if (this.fireState == 'special' && this.animState != 'special-fire') {
            this.animState = 'special-fire';

            this.scene.time.delayedCall(350, () => {
                this.anims.play('rogue-special-attack');
                let slashGroup = this.scene.physics.add.group({ immovable: true, allowGravity: false });
                let slash1 = this.scene.add.sprite(this.x + 120, this.y - 16, this.scene.make.renderTexture({ width: 169, height: 61 }).texture);
                slash1.setOrigin(0, 1);
                slash1.anims.play('rogue-slash');
                this.slashSound.play();
                slashGroup.add(slash1, false);
                let slash2 = this.scene.add.sprite(this.x - 120, this.y - 16, this.scene.make.renderTexture({ width: 169, height: 61 }).texture);
                slash2.setFlipX(true);
                slash2.setOrigin(0, 1);
                slash2.anims.play('rogue-slash');
                slashGroup.add(slash2, false);

                let entCollider = this.scene.physics.add.overlap(this.scene.entGroup, slashGroup, this.entitySlashOverlap, null, this);
                let spiderCollider = this.scene.physics.add.overlap(this.scene.spiderGroup, slashGroup, this.entitySlashOverlap, null, this);

                this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.setTexture('rogue');
                }, this);

                slash2.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.scene.physics.world.removeCollider(entCollider);
                    this.scene.physics.world.removeCollider(spiderCollider);
                    slashGroup.destroy(true);
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
                    if (this.heroState != 'dead') {
                        this.heroState = 'idle';
                        this.animState = 'idle';
                        this.anims.play('rogue-idle');
                    }
                },
                onCompleteScope: this
            }
            this.scene.tweens.add(tweenConfig);

            this.body.stop();
            this.lastSpecialFire = Date.now();
        }

        //console.log('heroState:' + this.heroState + ' animsState:' + this.animState + ' fireState:' + this.fireState);
    }

    entitySlashOverlap(entity, slash) {

    }

    kill() {
        if (this.heroState != 'dead') {
            this.animState = 'dead';
            this.heroState = 'dead';
            this.fireState = 'none';
            this.anims.play('rogue-death');
            this.dathSound.play();
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