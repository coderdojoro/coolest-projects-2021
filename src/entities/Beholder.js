// @ts-check
class Beholder extends Phaser.GameObjects.Sprite {

    direction = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

    loaded = false;

    beholderState = 'walk';

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 154, height: 101 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.image('beholder', 'assets/beholder/beholder.png');
        this.scene.load.spritesheet('beholderwalk-spritesheet', 'assets/beholder/walk.png', { frameWidth: 154, frameHeight: 101 });
        this.scene.load.spritesheet('beholderattack-spritesheet', 'assets/beholder/attack.png', { frameWidth: 154, frameHeight: 101 });
        this.scene.load.spritesheet('beholderdeath-spritesheet', 'assets/beholder/death.png', { frameWidth: 154, frameHeight: 101 });
        this.scene.load.spritesheet('dizzy-spritesheet', 'assets/dizzy.png', { frameWidth: 70, frameHeight: 25 });

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'beholder-walk',
                frames: this.scene.anims.generateFrameNumbers('beholderwalk-spritesheet', {}),
                frameRate: 5,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'beholder-attack',
                frames: this.scene.anims.generateFrameNumbers('beholderattack-spritesheet', {}),
                frameRate: 8,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'beholder-death',
                frames: this.scene.anims.generateFrameNumbers('beholderdeath-spritesheet', {}),
                frameRate: 8,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'dizzy',
                frames: this.scene.anims.generateFrameNumbers('dizzy-spritesheet', {}),
                frameRate: 8,
                repeat: -1,
            });

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);

            this.loaded = true;
            this.anims.play('beholder-walk');
        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(34, 56);
        this.body.setOffset(60, 37);

        this.body.onWorldBounds = true;
        this.body.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, this.worldColided, this);

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

        if (this.beholderState == 'dead') {
            return;
        }
        if (this.beholderState == 'dizzy') {
            if (Date.now() - this.dizzySatrt > 3000) {
                this.beholderState = 'walk';
                this.anims.play('beholder-walk');
                this.dizzySprite.destroy();
            }
            return;
        }
        if (this.beholderState == 'attack') {
            return;
        }

        let frontX;
        if (this.direction < 0) {
            frontX = this.body.left - 58;
        } else {
            frontX = this.body.right;
        }

        let overlapsWithHero = Phaser.Geom.Rectangle.Overlaps(
            new Phaser.Geom.Rectangle(this.scene.hero.body.left, this.scene.hero.body.top, this.scene.hero.body.width, this.scene.hero.body.height),
            new Phaser.Geom.Rectangle(frontX, this.body.top + 9, 58, 22)
        );

        if (overlapsWithHero && this.scene.hero.heroState != 'dead') {
            this.attackHero();
        }

        if (this.direction < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
        this.body.setMaxVelocity(80, 400);
        this.body.setAccelerationX(100 * this.direction);
    }

    groundColided(beholder, tile) {
        if (this.beholderState == 'dead') {
            return;
        }
        if (this.beholderState == 'dizzy') {
            return;
        }

        if (Math.trunc(beholder.body.bottom) - tile.pixelY > 0) {
            this.direction = this.direction * -1;
        }

        var tileInFront;
        if (this.direction < 0) {
            tileInFront = this.scene.groundLayer.getTileAtWorldXY(this.body.left - 1, this.body.bottom);
        } else {
            tileInFront = this.scene.groundLayer.getTileAtWorldXY(this.body.right + 1, this.body.bottom);
        }

        if (!tileInFront) {
            this.body.velocity.x = 0;
            this.direction = this.direction * -1;
        }

    }

    worldColided(beholder) {
        if (this.beholderState == 'dead') {
            return;
        }
        if (beholder.gameObject.name != this.name) {
            return;
        }
        this.direction = this.direction * -1;
    }

    heroOverlap(hero, beholder) {
        if (this.beholderState == 'dead') {
            return;
        }
        if (this.beholderState == 'dizzy') {
            return;
        }

        if (this.beholderState != 'attack' && hero.heroState != 'dead') {
            if (this.body.left + this.body.halfWidth < hero.body.left + hero.body.halfWidth) {
                this.setFlipX(false);
                this.direction = 1;
            } else {
                this.setFlipX(true);
                this.direction = -1;
            }
            this.attackHero();
        }
    }

    attackHero() {
        this.beholderState = 'attack';
        this.body.velocity.x = 0;
        this.body.setAccelerationX(0);
        this.anims.play('beholder-attack');
        this.scene.hero.kill();
        this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            this.beholderState = 'walk';
            this.anims.play('beholder-walk');
        }, this);
    }

    kill() {
        if (this.beholderState == 'dead') {
            return;
        }
        this.beholderState = 'dead';
        this.anims.play('beholder-death');
        this.body.velocity.x = 0;
        this.body.setAccelerationX(0);
        if (this.dizzySprite) {
            this.dizzySprite.destroy();
        }
    }

    makeDizzy() {
        if (this.beholderState == 'dead') {
            return;
        }
        this.dizzySatrt = Date.now();
        this.body.velocity.x = 0;
        this.body.setAccelerationX(0);
        if (this.beholderState == 'dizzy') {
            return;
        }
        this.beholderState = 'dizzy';
        this.anims.stop();
        this.setTexture('beholder');
        this.dizzySprite = this.scene.physics.add.sprite(this.body.left - 15, this.body.top, null);
        this.dizzySprite.setOrigin(0, 1);
        this.dizzySprite.anims.play("dizzy");
        this.dizzySprite.body.immovable = true;
        this.dizzySprite.body.setAllowGravity(false);
    }

}

export default Beholder;