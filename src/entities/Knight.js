// @ts-check
class Knight extends Phaser.GameObjects.Sprite {
    keyLeft;
    keyRight;
    keyJump;
    keyFire;
    keySpecialFire;

    heroState = "fall";
    animState = "fall";

    fireState = "none";

    lastFire = 0;
    lastSpecialFire = 0;

    constructor(scene, x, y) {
        super(scene, x, y, "hero");
        this.initialX = x;
        this.initialY = y;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }
        this.body.setCollideWorldBounds(true);
        this.body.setSize(31, 50);
        this.body.setOffset(72, 59);
        this.anims.play('hero-idle');
        this.body.setDragX(1100);
        this.body.setGravityY(700);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keySpecialFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    }

    isOnFlor() {
        let onGround = this.body.onFloor() && this.body.velocity.y == 0;
        return onGround;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        if (this.heroState != 'landing' && this.heroState != "dead" && this.isOnFlor() && (this.heroState == 'double-jump' || this.heroState == 'fall')) {
            this.heroState = 'landing';
            this.body.setVelocityX(0);
            this.body.setAcceleration(0);
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isUp && this.keyRight.isUp && this.isOnFlor()) {
            this.body.setAccelerationX(0);
            this.heroState = 'idle';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isDown && this.isOnFlor()) {
            this.body.setMaxVelocity(200, 600);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = "walk"
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyRight.isDown && this.isOnFlor()) {
            this.body.setMaxVelocity(200, 600);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = "walk"

        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyLeft.isDown && this.keyShift.isDown && this.isOnFlor()) {
            this.body.setMaxVelocity(400, 600);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'run';
        }

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && this.keyRight.isDown && this.keyShift.isDown && this.isOnFlor()) {
            this.body.setMaxVelocity(400, 600);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'run';
        }

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump)

        if (this.fireState != 'special' && this.heroState != 'landing' && this.heroState != "dead" && justDown && this.heroState != 'jump' && this.isOnFlor()) {
            this.body.setVelocityY(-400);
            this.heroState = 'jump';
            justDown = false;
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

        if (this.heroState != "dead" && !this.body.onFloor() && !(this.heroState == 'jump' || this.heroState == 'double-jump') && this.body.velocity.y > 0 && this.heroState != 'fall' && this.fireState == 'none') {
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

        if (this.fireState != 'special' && this.fireState != 'fire' && this.isOnFlor() && this.heroState != 'landing' && this.heroState != "dead" && this.keySpecialFire.isDown && Date.now() - this.lastSpecialFire > 2000) {
            this.fireState = 'special';
            this.lastSpecialFire = Date.now();
        }

        if (this.heroState == "idle" && this.animState != 'idle' && this.fireState == 'none') {
            this.anims.play("hero-idle");
            this.animState = "idle"

        }
        if (this.heroState == "walk" && this.fireState == 'none' && this.animState != "walk") {
            this.anims.play("hero-walk");
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
        if (this.heroState == 'fall' && this.animState != 'fall' && this.animState != 'attack' && this.fireState == 'none') {
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
                this.scene.cameras.main.shake(600, 0.002);
            }, this);
            this.lastFire = Date.now();
        }

        console.log('heroState:' + this.heroState + ' animsState:' + this.animState + " fireState:" + this.fireState);

    }

    colided(hero, tile) {
        if (tile.properties && tile.properties.tileType == 'ice') {
            this.body.setDragX(40);
            this.onIce = true;
        } else {
            this.body.setDragX(1100);
            this.onIce = false;
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
            this.anims.play('hero-death');
            this.body.setVelocity(0, 0);
            this.body.setAcceleration(0);
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, this.onAnimationComplete, this);
        }
        this.animState = "dead";
        this.heroState = "dead";

    }


}

export default Knight;