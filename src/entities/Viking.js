// @ts-check
class Viking extends Phaser.GameObjects.Sprite {

    loaded = false;

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 60, height: 48 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.spritesheet('walk-spritesheet', 'assets/viking1/walk.png', { frameWidth: 52, frameHeight: 60 });

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'viking-walk',
                frames: this.scene.anims.generateFrameNumbers('walk-spritesheet', {}),
                frameRate: 6,
                repeat: -1
            });

            this.loaded = true;
        }, this);

        this.body.setCollideWorldBounds(true);
        this.body.setSize(31, 50);
        this.body.setOffset(72, 59);
        this.body.setDragX(1100);
        this.body.setGravityY(700);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.loaded) {
            return;
        }

    }

}

export default Viking;