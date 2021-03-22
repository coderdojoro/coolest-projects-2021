// @ts-check
class Wolf extends Phaser.GameObjects.Sprite {

    direction = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

    loaded = false;

    wolfState = 'run';

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 60, height: 48 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.image('wolf', 'assets/wolf/wolf.png');
        this.scene.load.spritesheet('wolfrun-spritesheet', 'assets/wolf/run.png', { frameWidth: 60, frameHeight: 48 });
        this.scene.load.spritesheet('wolfattack-spritesheet', 'assets/wolf/attack.png', { frameWidth: 73, frameHeight: 48 });
        this.scene.load.spritesheet('wolfdeath-spritesheet', 'assets/wolf/death.png', { frameWidth: 60, frameHeight: 48 });
        this.scene.load.spritesheet('dizzy-spritesheet', 'assets/dizzy.png', { frameWidth: 70, frameHeight: 25 });

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
            this.scene.anims.create({
                key: 'dizzy',
                frames: this.scene.anims.generateFrameNumbers('dizzy-spritesheet', {}),
                frameRate: 10,
                repeat: -1,
            });

            this.loaded = true;
            this.anims.play('wolf-run');
        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(34, 22);
        this.body.setOffset(14, 26);

		this.setScale(1.5);
		
        this.body.onWorldBounds = true;
        this.body.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, this.worldColided, this);

        
        this.scene.physics.add.overlap(this.scene.hero, this, this.heroOverlap, null, this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        console.log(this.wolfState);

        if (!this.loaded) {
            return;
        }
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }
        // this.scene.add.circle(this.body.x + this.body.halfWidth, this.y - 16, 2, Phaser.Math.Between(0, 0xffffff));

        if (this.wolfState == 'dead') {
            return;
        }
        if (this.wolfState == 'dizzy') {
            if (Date.now() - this.dizzySatrt > 3000) {
                this.wolfState = 'run';
                this.anims.play('wolf-run');
                this.dizzySprite.destroy();
            }
            return;
        }
        if (this.wolfState == 'attack') {
            return;
        }

        if (this.direction < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
        this.body.setMaxVelocity(150, 400);
        this.body.setAccelerationX(300 * this.direction);
    }

    groundColided(wolf, tile) {
        if (this.wolfState == 'dead') {
            return;
        }
        if (this.wolfState == 'dizzy') {
            return;
        }
        // this.scene.add.circle(this.x + this.body.offset.x + this.body.width, this.y, 2, 0xff0000);
        // this.scene.add.circle(this.x, this.y, 2, 0xff0000);
        if (wolf.y == tile.pixelY + 64 || wolf.y == tile.pixelY + 32) {
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
        if (this.wolfState == 'dead') {
            return;
        }
        if (wolf.gameObject.name != this.name) {
            return;
        }
        this.direction = this.direction * -1;
    }

    heroOverlap(hero, wolf) {
        if (this.wolfState == 'dead') {
            return;
        }
        if (this.wolfState == 'dizzy') {
            return;
        }

        if (this.wolfState != 'attack' && hero.heroState != 'dead') {
            if (this.body.x + this.body.halfWidth < hero.body.x + hero.body.halfWidth) {
                this.setFlipX(false);
                this.direction = 1;
            } else {
                this.setFlipX(true);
                this.direction = -1;
            }
            this.wolfState = 'attack';
            this.body.velocity.x = 0;
            this.body.setAccelerationX(0);
            this.anims.play('wolf-attack');
            hero.kill();
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.wolfState = 'run';
                this.anims.play('wolf-run');
                this.setX(this.x + 40 * this.direction);
            }, this);
        }
    }

    kill() {
        if (this.wolfState == 'dead') {
            return;
        }
        this.wolfState = 'dead';
        this.anims.play('wolf-death');
        this.body.velocity.x = 0;
        this.body.setAccelerationX(0);
        if (this.dizzySprite) {
            this.dizzySprite.destroy();
        }
    }

    makeDizzy() {
        if (this.wolfState == 'dead') {
            return;
        }
        this.dizzySatrt = Date.now();
        this.body.velocity.x = 0;
        this.body.setAccelerationX(0);
        if (this.wolfState == 'dizzy') {
            return;
        }
        this.wolfState = 'dizzy';
        this.anims.stop();
        this.setTexture('wolf');
        let x = this.direction == 1 ? this.x + 35 : this.x - 5;
        this.dizzySprite = this.scene.physics.add.sprite(x, this.y - 30, null);
        this.dizzySprite.setOrigin(0, 1);
        this.dizzySprite.anims.play("dizzy");
        this.dizzySprite.body.immovable = true;
        this.dizzySprite.body.setAllowGravity(false);
    }

}

export default Wolf;