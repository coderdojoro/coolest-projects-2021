// @ts-check
class Wolf extends Phaser.GameObjects.Sprite {

    loaded = false;

    direction = 1;

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 60, height: 48 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.spritesheet('run-spritesheet', 'assets/wolf/run.png', { frameWidth: 60, frameHeight: 48 });

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'wolf-run',
                frames: this.scene.anims.generateFrameNumbers('run-spritesheet', {}),
                frameRate: 6,
                repeat: -1
            });

            this.loaded = true;
            this.anims.play('wolf-run');
        }, this);
        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(34, 22);
        this.body.setOffset(14, 26);
        this.body.setDragX(0);
        this.body.setGravityY(0);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.loaded) {
            return;
        }
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        this.body.setMaxVelocity(200, 400);
        this.body.setAccelerationX(300 * this.direction);
    }

    groundColided(hero, tile) {
        // console.log(tile);
    }

}

export default Wolf;