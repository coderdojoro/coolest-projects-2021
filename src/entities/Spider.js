// @ts-check
class Spider extends Phaser.GameObjects.Sprite {

    direction = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

    loaded = false;

    spiderState = 'walk';

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 128, height: 128 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.image('spider', 'assets/spider/spider.png');
        this.scene.load.spritesheet('spiderwalk-spritesheet', 'assets/spider/walk.png', { frameWidth: 128, frameHeight: 128 });
        this.scene.load.spritesheet('spiderattack-spritesheet', 'assets/spider/attack.png', { frameWidth: 128, frameHeight: 128 });
        this.scene.load.spritesheet('spiderdeath-spritesheet', 'assets/spider/death.png', { frameWidth: 128, frameHeight: 128 });
        this.scene.load.spritesheet('dizzy-spritesheet', 'assets/dizzy.png', { frameWidth: 70, frameHeight: 25 });
        this.scene.load.audio("spider-attack-sound", "assets/spider/attack.mp3");
        this.scene.load.audio("spider-death-sound", "assets/spider/death.mp3");

        this.scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.scene.anims.create({
                key: 'spider-walk',
                frames: this.scene.anims.generateFrameNumbers('spiderwalk-spritesheet', {}),
                frameRate: 5,
                repeat: -1
            });
            this.scene.anims.create({
                key: 'spider-attack',
                frames: this.scene.anims.generateFrameNumbers('spiderattack-spritesheet', {}),
                frameRate: 15,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'spider-death',
                frames: this.scene.anims.generateFrameNumbers('spiderdeath-spritesheet', {}),
                frameRate: 8,
                repeat: 0
            });
            this.scene.anims.create({
                key: 'dizzy',
                frames: this.scene.anims.generateFrameNumbers('dizzy-spritesheet', {}),
                frameRate: 8,
                repeat: -1,
            });
            this.attackSound = this.scene.sound.add("spider-attack-sound", {
                loop: false,
                volume: 1
            });
            this.deathSound = this.scene.sound.add("spider-death-sound", {
                loop: false,
                volume: 1
            });

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);

            this.loaded = true;
            this.anims.play('spider-walk');
        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(49, 38);
        this.body.setOffset(40, 45);

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

        if (this.spiderState == 'dead') {
            return;
        }
        if (this.spiderState == 'dizzy') {
            if (Date.now() - this.dizzySatrt > 3000) {
                this.spiderState = 'walk';
                this.anims.play('spider-walk');
                this.dizzySprite.destroy();
            }
            return;
        }
        if (this.spiderState == 'attack') {
            return;
        }

        let frontX;
        if (this.direction < 0) {
            frontX = this.body.left - 39;
        } else {
            frontX = this.body.right;
        }

        let overlapsWithHero = Phaser.Geom.Rectangle.Overlaps(
            new Phaser.Geom.Rectangle(this.scene.hero.body.left, this.scene.hero.body.top, this.scene.hero.body.width, this.scene.hero.body.height),
            new Phaser.Geom.Rectangle(frontX, this.body.top + 17, 39, 21)
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

    groundColided(spider, tile) {
        if (this.spiderState == 'dead') {
            return;
        }
        if (this.spiderState == 'dizzy') {
            return;
        }

        if (Math.trunc(spider.body.bottom) - tile.pixelY > 0) {
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

    worldColided(spider) {
        if (this.spiderState == 'dead') {
            return;
        }
        if (spider.gameObject.name != this.name) {
            return;
        }
        this.direction = this.direction * -1;
    }

    heroOverlap(hero, spider) {
        if (this.spiderState == 'dead') {
            return;
        }
        if (this.spiderState == 'dizzy') {
            return;
        }

        if (this.spiderState != 'attack' && hero.heroState != 'dead') {
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
        this.spiderState = 'attack';
        this.body.stop();
        this.anims.play('spider-attack');
        this.attackSound.play();
        this.scene.hero.kill();
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.spiderState = 'walk';
            this.anims.play('spider-walk');
        }, this);
    }

    kill() {
        if (this.spiderState == 'dead') {
            return;
        }
        this.spiderState = 'dead';
        this.anims.play('spider-death');
        this.deathSound.play();
        this.body.stop();
        if (this.dizzySprite) {
            this.dizzySprite.destroy();
        }
    }

    makeDizzy() {
        if (this.spiderState == 'dead') {
            return;
        }
        this.dizzySatrt = Date.now();
        this.body.stop();
        if (this.spiderState == 'dizzy') {
            return;
        }
        this.spiderState = 'dizzy';
        this.anims.stop();
        this.setTexture('spider');
        this.dizzySprite = this.scene.physics.add.sprite(this.body.left - 15, this.body.top, null);
        this.dizzySprite.setOrigin(0, 1);
        this.dizzySprite.anims.play("dizzy");
        this.dizzySprite.body.immovable = true;
        this.dizzySprite.body.setAllowGravity(false);
    }

}

export default Spider;