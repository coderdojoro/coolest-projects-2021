// @ts-check
class Wolf extends Phaser.GameObjects.Sprite {

    direction = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

    loaded = false;

    wolfState = 'run';

    constructor(scene, x, y) {
        super(scene, x, y, scene.make.renderTexture({ width: 78, height: 48 }).texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.load.image('wolf', 'assets/wolf/wolf.png');
        this.scene.load.spritesheet('wolfrun-spritesheet', 'assets/wolf/run.png', { frameWidth: 78, frameHeight: 48 });
        this.scene.load.spritesheet('wolfattack-spritesheet', 'assets/wolf/attack.png', { frameWidth: 78, frameHeight: 48 });
        this.scene.load.spritesheet('wolfdeath-spritesheet', 'assets/wolf/death.png', { frameWidth: 78, frameHeight: 48 });
        this.scene.load.spritesheet('dizzy-spritesheet', 'assets/dizzy.png', { frameWidth: 70, frameHeight: 25 });
        this.scene.load.audio("wolf-attack-sound", "assets/wolf/attack.mp3");
        this.scene.load.audio("wolf-death-sound", "assets/wolf/death.mp3");

        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
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
            this.attackSound = this.scene.sound.add("wolf-attack-sound", {
                loop: false,
                volume: 1
            });
            this.deathSound = this.scene.sound.add("wolf-death-sound", {
                loop: false,
                volume: 1
            });

            this.x = this.x - (this.body.left - this.x);
            this.y = this.y + (this.y - this.body.bottom);

            this.loaded = true;
            this.anims.play('wolf-run');
        }, this);

        this.scene.load.start();

        this.setOrigin(0, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(34, 22);
        this.body.setOffset(22, 26);

        this.setScale(1.5);

        this.body.onWorldBounds = true;
        this.body.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, this.worldCollided, this);

        this.scene.physics.add.overlap(this.scene.hero, this, this.heroOverlap, null, this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.loaded == false) {
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

        let frontX;
        if (this.direction < 0) {
            frontX = this.body.left - 22;
        } else {
            frontX = this.body.right;
        }

        let overlapsWithHero = Phaser.Geom.Rectangle.Overlaps(
            new Phaser.Geom.Rectangle(this.scene.hero.body.left, this.scene.hero.body.top, this.scene.hero.body.width, this.scene.hero.body.height),
            new Phaser.Geom.Rectangle(frontX, this.body.top, 22, 22)
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

        if (Math.trunc(wolf.body.bottom) - tile.pixelY > 0) {
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

    worldCollided(wolf) {
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
        this.wolfState = 'attack';
        this.body.stop();
        this.attackSound.play();
        this.anims.play('wolf-attack');
        this.scene.hero.kill();
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.wolfState = 'run';
            this.anims.play('wolf-run');
            // lupul se teleportează înapoi după atac
            //this.setX(this.x + 22 * this.direction);
        }, this);
    }

    kill() {
        if (this.wolfState == 'dead') {
            return;
        }
        this.wolfState = 'dead';
        this.anims.play('wolf-death');
        this.deathSound.play();
        this.body.stop();
        if (this.dizzySprite) {
            this.dizzySprite.destroy();
        }
    }

    makeDizzy() {
        if (this.wolfState == 'dead') {
            return;
        }
        this.dizzySatrt = Date.now();
        this.body.stop();
        if (this.wolfState == 'dizzy') {
            return;
        }
        this.wolfState = 'dizzy';
        this.anims.stop();
        this.setTexture('wolf');
        if (this.direction < 0) {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }
        let x = this.direction == 1 ? this.body.right - 36 : this.body.left - 18;
        this.dizzySprite = this.scene.physics.add.sprite(x, this.y - 30, null);
        this.dizzySprite.setOrigin(0, 1);
        this.dizzySprite.anims.play("dizzy");
        this.dizzySprite.body.immovable = true;
        this.dizzySprite.body.setAllowGravity(false);
    }

}

export default Wolf;