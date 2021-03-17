// @ts-check
class Wolf extends Phaser.GameObjects.Sprite {

    loaded = false;
    direction = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;
    groundLayer;
    alive = true;

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 60, height: 48 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.spritesheet('wolfrun-spritesheet', 'assets/wolf/run.png', { frameWidth: 60, frameHeight: 48 });
        this.scene.load.spritesheet('wolfattack-spritesheet', 'assets/wolf/attack.png', { frameWidth: 73, frameHeight: 48 });
        this.scene.load.spritesheet('wolfdeath-spritesheet', 'assets/wolf/death.png', { frameWidth: 60, frameHeight: 48 });

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'wolf-run',
                frames: this.scene.anims.generateFrameNumbers('wolfrun-spritesheet', {}),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'wolf-attack',
                frames: this.scene.anims.generateFrameNumbers('wolfattack-spritesheet', {}),
                frameRate: 10,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'wolf-death',
                frames: this.scene.anims.generateFrameNumbers('wolfdeath-spritesheet', {}),
                frameRate: 10,
                repeat: 0
            });

            this.loaded = true;
            this.anims.play('wolf-run');
        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(34, 22);
        this.body.setOffset(14, 26);
        this.body.setDragX(10000);
        this.body.setGravityY(0);

        this.body.onWorldBounds = true;
        this.body.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, this.worldColided, this);

        this.setScale(1.5);
        this.scene.physics.add.overlap(this.scene.hero, this, this.heroOverlap, null, this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.loaded) {
            return;
        }
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }
        // this.scene.add.circle(this.body.x + this.body.halfWidth, this.y - 16, 2, Phaser.Math.Between(0, 0xffffff));

        if (!this.alive) {
            return;
        }

        if (this.attack) {
            return;
        }

        // if (this.scene.hero.fireState == 'fire') {
        //     if (this.scene.hero.flipX) {

        //     } else {
        //         console.log("x:" + this.body.offset.x + ", w:" + this.body.width);
        //         let rectangle = this.scene.add.rectangle(this.scene.hero.x + this.scene.hero.body.offset.x + this.scene.hero.body.width, this.scene.hero.y - (128 - this.scene.hero.body.offset.y - this.scene.hero.body.height), 50, 64, 0xff0000);
        //         rectangle.setOrigin(0, 1);
        //         this.scene.physics
        //     }

        // }

        if (this.direction < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
        this.body.setMaxVelocity(150, 400);
        this.body.setAccelerationX(300 * this.direction);

    }

    groundColided(wolf, tile) {
        if (!this.alive) {
            return;
        }
        // this.scene.add.circle(this.x + this.body.offset.x + this.body.width, this.y, 2, 0xff0000);
        // this.scene.add.circle(this.x, this.y, 2, 0xff0000);
        if (wolf.y == tile.pixelY + 32) {
            this.direction = this.direction * -1;
        }
        if (tile.pixelY == wolf.y) {
            let tileX = this.x + (this.direction < 0 ? -1 * this.body.offset.x : this.body.width + this.body.offset.x + 14) * this.direction;
            if (tileX < 0) {
                return;
            }
            // this.scene.add.circle(tileX, this.y + 32 / 2, 2, Phaser.Math.Between(0, 0xffffff));
            var tileInFront = this.scene.groundLayer.getTileAtWorldXY(tileX, this.y + 32 / 2);
            if (!tileInFront) {
                this.body.velocity.x = 0;
                this.body.setAccelerationX(0);
                this.direction = this.direction * -1;
            }
        }
    }

    worldColided(wolf) {
        if (!this.alive) {
            return;
        }
        if (wolf.gameObject.name != this.name) {
            return;
        }
        this.direction = this.direction * -1;
    }

    heroOverlap(hero, wolf) {
        if (!this.alive) {
            return;
        }
        if (!this.attack && hero.heroState != 'dead') {
            if (this.body.x + this.body.halfWidth < hero.body.x + hero.body.halfWidth) {
                this.setFlipX(false);
                this.direction = 1;
            } else {
                this.setFlipX(true);
                this.direction = -1;
            }
            this.attack = true;
            this.body.velocity.x = 0;
            this.body.setAccelerationX(0);
            this.anims.play('wolf-attack');
            hero.kill();
            this.attack = true;
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.attack = false;
                this.anims.play('wolf-run');
                this.setX(this.x + 40 * this.direction);
            }, this);
        }
    }

    kill() {
        if (!this.alive) {
            return;
        }
        this.alive = false;
        this.anims.play('wolf-death');
        this.body.velocity.x = 0;
        this.body.setAccelerationX(0);
    }

}

export default Wolf;