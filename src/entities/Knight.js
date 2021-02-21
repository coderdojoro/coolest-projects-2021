// @ts-check
class Knight extends Phaser.GameObjects.Sprite {
    keyLeft;
    keyRight;
    keyJump;

    heroState = "idle";
    animState = "idle";
    constructor(scene, x, y) {
        super(scene, x, y, "mage");
        this.initialX = x;
        this.initialY = y;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }
        this.body.setCollideWorldBounds(true);
        this.body.setSize(30, 53)
        this.body.setOffset(70, 57)
        this.anims.play('hero-idle');
        this.body.setDragX(1100);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        if (this.keyLeft.isUp && this.keyRight.isUp && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setAccelerationX(0);
            this.heroState = "idle";

        }
        if (this.keyLeft.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            // this.body.setVelocityX(-500);
            this.body.setMaxVelocity(200, 400);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = "walk"
        }


        if (this.keyRight.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            // this.body.setVelocityX(500);
            this.body.setMaxVelocity(200, 400);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = "walk"

        }

        if (this.keyLeft.isDown && this.keyShift.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setMaxVelocity(400, 400);
            if (this.onIce) {
                this.body.setAccelerationX(-100);
            } else {
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = 'run';
        }

        if (this.keyRight.isDown && this.keyShift.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setMaxVelocity(400, 400);
            if (this.onIce) {
                this.body.setAccelerationX(100);
            } else {
                this.body.setAccelerationX(500);
            }
            this.setFlipX(false);
            this.heroState = 'run';
        }

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump)
        if (justDown && this.heroState != 'jump' && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setVelocityY(-300);
            this.heroState = 'jump';
            justDown = false;
            this.body.setVelocityX(0);
        }

        if (justDown && this.heroState == 'jump') {
            this.body.setVelocityY(-300);
            this.heroState = 'double-jump';
            this.body.setVelocityX(0);
        }

        if (!this.body.onFloor() && !(this.heroState == 'jump' || this.heroState == 'double-jump') && this.body.velocity.y > 0 && this.heroState != 'fall' && this.animState != 'attack') {
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

        if (this.heroState == "idle" && this.animState != 'idle') {
            this.anims.play("hero-idle");
            this.animState = "idle"

        }
        if (this.heroState == "walk" && this.animState != "walk") {
            this.anims.play("hero-walk");
            this.animState = "walk";
        }
        if (this.heroState == 'run' && this.animState != 'run' && this.animState != 'attack') {
            this.animState = 'run';
            this.anims.play('hero-run');
        }
        if (this.heroState == 'jump' && this.animState != 'jump') {
            this.anims.play('hero-jump');
            this.animState = 'jump';
        }
        if (this.heroState == 'double-jump' && this.animState != 'double-jump') {
            this.anims.play('hero-double-jump');
            this.animState = 'double-jump';
        }
        if (this.heroState == 'fall' && this.animState != 'fall' && this.animState != 'attack') {
            this.animState = 'fall';
            this.anims.play('hero-fall');
        }

        console.log('heroState:' + this.heroState + ' animsState:' + this.animState);

    }

    colided(hero, tile) {
        if (tile.properties && tile.properties.tileType == 'ice') {
            this.body.setDragX(40);
            this.onIce = true;
        } else {
            this.body.setDragX(1100);
            this.onIce = false;
        }

        if (tile.properties && tile.properties.tileType == 'spike') {
            this.setX(this.initialX);
            this.setY(this.initialY - 32);
        }

    }


}

export default Knight;