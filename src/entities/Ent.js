// @ts-check
class Ent extends Phaser.GameObjects.Sprite {

    direction = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

    loaded = false;

    entState = 'walk';

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 240, height: 189 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.image('ent', 'assets/ent/ent.png');
        this.scene.load.spritesheet('entwalk-spritesheet', 'assets/ent/walk.png', { frameWidth: 240, frameHeight: 189 });
        this.scene.load.spritesheet('entattack-spritesheet', 'assets/ent/attack.png', { frameWidth: 240, frameHeight: 189 });
        this.scene.load.spritesheet('entdeath-spritesheet', 'assets/ent/death.png', { frameWidth: 240, frameHeight: 189 });
        this.scene.load.spritesheet('dizzy-spritesheet', 'assets/dizzy.png', { frameWidth: 70, frameHeight: 25 });
        this.scene.load.audio("ent-attack-sound", "assets/ent/attack.mp3");
        this.scene.load.audio("ent-death-sound", "assets/ent/death.mp3");

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'ent-walk',
                frames: this.scene.anims.generateFrameNumbers('entwalk-spritesheet', {}),
                frameRate: 5,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'ent-attack',
                frames: this.scene.anims.generateFrameNumbers('entattack-spritesheet', {}),
                frameRate: 8,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'ent-death',
                frames: this.scene.anims.generateFrameNumbers('entdeath-spritesheet', {}),
                frameRate: 8,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'dizzy',
                frames: this.scene.anims.generateFrameNumbers('dizzy-spritesheet', {}),
                frameRate: 8,
                repeat: -1,
            });
            this.attackSound = this.scene.sound.add("ent-attack-sound", {
                loop: false,
                volume: 1
            });
            this.deathSound = this.scene.sound.add("ent-death-sound", {
                loop: false,
                volume: 1
            });

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);

            this.loaded = true;
            this.anims.play('ent-walk');
        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(31, 95);
        this.body.setOffset(107, 80);

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

        if (this.entState == 'dead') {
            return;
        }
        if (this.entState == 'dizzy') {
            if (Date.now() - this.dizzySatrt > 3000) {
                this.entState = 'walk';
                this.anims.play('ent-walk');
                this.dizzySprite.destroy();
            }
            return;
        }
        if (this.entState == 'attack') {
            return;
        }

        let frontX;
        if (this.direction < 0) {
            frontX = this.body.left - 80;//101
        } else {
            frontX = this.body.right;
        }

        let overlapsWithHero = Phaser.Geom.Rectangle.Overlaps(
            new Phaser.Geom.Rectangle(this.scene.hero.body.left, this.scene.hero.body.top, this.scene.hero.body.width, this.scene.hero.body.height),
            new Phaser.Geom.Rectangle(frontX, this.body.top + 34, 80, 61)
        );

        if (overlapsWithHero && this.scene.hero.heroState != 'dead') {
            this.attackHero();
            return;
        }

        if (this.direction < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
        this.body.setMaxVelocity(80, 400);
        this.body.setAccelerationX(100 * this.direction);
    }

    groundColided(ent, tile) {
        if (this.entState == 'dead') {
            return;
        }
        if (this.entState == 'dizzy') {
            return;
        }

        if (Math.trunc(ent.body.bottom) - tile.pixelY > 0) {
            this.direction = this.direction * -1;
        }

        var tileInFront;
        if (this.direction < 0) {
            tileInFront = this.scene.groundLayer.getTileAtWorldXY(this.body.left - 1, this.body.bottom);
        } else {
            tileInFront = this.scene.groundLayer.getTileAtWorldXY(this.body.right + 1, this.body.bottom);
        }

        if (!tileInFront) {
            this.body.setVelocityX(0);
            this.direction = this.direction * -1;
        }
    }

    worldColided(ent) {
        if (this.entState == 'dead') {
            return;
        }
        if (ent.gameObject.name != this.name) {
            return;
        }
        this.direction = this.direction * -1;
    }

    heroOverlap(hero, ent) {
        if (this.entState == 'dead') {
            return;
        }
        if (this.entState == 'dizzy') {
            return;
        }

        if (this.entState != 'attack' && hero.heroState != 'dead') {
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
        this.entState = 'attack';
        this.body.stop();
        this.attackSound.play();
        this.anims.play('ent-attack');
        this.scene.hero.kill();
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.entState = 'walk';
            this.anims.play('ent-walk');
        }, this);
    }

    kill() {
        if (this.entState == 'dead') {
            return;
        }
        this.entState = 'dead';
        this.anims.play('ent-death');
        this.deathSound.play();
        this.body.stop();
        if (this.dizzySprite) {
            this.dizzySprite.destroy();
        }
    }

    makeDizzy() {
        if (this.entState == 'dead') {
            return;
        }
        this.dizzySatrt = Date.now();
        this.body.stop();
        if (this.entState == 'dizzy') {
            return;
        }
        this.entState = 'dizzy';
        this.anims.stop();
        this.setTexture('ent');
        this.dizzySprite = this.scene.physics.add.sprite(this.body.left - 15, this.body.top, null);
        this.dizzySprite.setOrigin(0, 1);
        this.dizzySprite.anims.play("dizzy");
        this.dizzySprite.body.immovable = true;
        this.dizzySprite.body.setAllowGravity(false);
    }

}

export default Ent;