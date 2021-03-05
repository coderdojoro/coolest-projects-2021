// @ts-check

class Rogue extends Phaser.GameObjects.Sprite {

    keyLeft;
    keyRight;
    keyJump;

    heroState = 'idle';
    animState = 'idle';

    waterGroup;
    scene;

    constructor(scene, x, y, waterGroup) {
        super(scene, x, y, 'hero');
        this.waterGroup = waterGroup;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        this.body.setCollideWorldBounds(true);
        this.body.setSize(30, 54);
        this.body.setOffset(70, 57);
        this.anims.play('hero-idle');
        this.body.setDragX(1100);
        this.body.setGravityY(700);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }

    isOnFloor() {
        //on ground
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

        if (this.keyLeft.isUp && this.keyRight.isUp && this.isOnFloor()) {
            this.body.setAccelerationX(0);
            this.heroState = "idle";
        }

        if (this.keyLeft.isDown && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setMaxVelocity(40, 400);
                this.body.setAccelerationX(-150);
            } else {
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(-500);
            }
            this.setFlipX(true);
            this.heroState = "walk";
        }

        if (this.keyRight.isDown && this.isOnFloor()) {
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

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump);

        if (justDown && this.heroState != 'jump' && this.isOnFloor()) {
            if (this.isInWater()) {
                this.body.setVelocityY(-120);
            } else {
                this.body.setVelocityY(-250);
            }
            justDown = false;
            this.heroState = 'jump';
        }

        if (justDown && this.heroState == 'jump') {
            this.body.setVelocityY(-400);
            this.heroState = 'double-jump';
        }

        if (this.heroState == 'jump' || this.heroState == 'double-jump' || this.heroState == 'fall') {
            if (this.keyRight.isDown) {
                this.setFlipX(false);
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(500);
            }
            if (this.keyLeft.isDown) {
                this.setFlipX(true);
                this.body.setMaxVelocity(200, 400);
                this.body.setAccelerationX(-500);
            }
        }

        if (this.heroState == "idle" && this.animState != "idle") {
            this.anims.play('hero-idle');
            this.animState = "idle";
        }
        if (this.heroState == "walk" && this.animState != "walk") {
            this.anims.play('hero-walk');
            this.animState = "walk";
        }
        if (this.heroState == 'jump' && this.animState != 'jump') {
            this.anims.play('hero-jump');
            this.animState = 'jump';
        }

        if (this.heroState == 'double-jump' && this.animState != 'double-jump') {
            this.anims.play('hero-double-jump');
            this.animState = 'double-jump';
        }

        console.log("heroState:" + this.heroState + " animState:" + this.animState);

    }

}

export default Rogue;