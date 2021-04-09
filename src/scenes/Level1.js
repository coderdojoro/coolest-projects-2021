
// @ts-check

import Phaser from 'phaser';
import Ent from '../entities/Ent.js';
import Rogue from '../entities/Rogue.js';

class Level1 extends Phaser.Scene {

  constructor() {
    super('Level1');
  }

  preload() {
    this.load.image('hero', 'assets/rogue/rogue.png');
    this.load.spritesheet('idle-spritesheet', 'assets/rogue/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/rogue/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('run-spritesheet', 'assets/rogue/run.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/rogue/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('double-jump-spritesheet', 'assets/rogue/double-jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('fall-spritesheet', 'assets/rogue/fall.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('death-spritesheet', 'assets/rogue/death.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('landing-spritesheet', `assets/rogue/landing.png`, { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('attack-spritesheet', `assets/rogue/attack.png`, { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('special-attack-spritesheet', `assets/rogue/special-attack.png`, { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-attack-spritesheet', `assets/rogue/walk-attack.png`, { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('run-attack-spritesheet', `assets/rogue/run-attack.png`, { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('slash-spritesheet', `assets/rogue/slash.png`, { frameWidth: 169, frameHeight: 61 });

    this.load.tilemapTiledJSON('level1-tilemap', 'assets/level1-tilemap.json');

    this.load.spritesheet('ground-image', 'assets/tiles/level1-tiles.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('bush-image', 'assets/tiles/level1-bush.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('rocks-image', 'assets/tiles/level1-rocks.png');

    this.load.image('background4', 'assets/wallpapers/forest/background4.png');
    this.load.image('background3', 'assets/wallpapers/forest/background3.png');
    this.load.image('background2', 'assets/wallpapers/forest/background2.png');
    this.load.image('background1', 'assets/wallpapers/forest/background1.png');

    this.load.spritesheet('campfire', 'assets/tiles/campfire.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('flag', 'assets/tiles/flag.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('torch', 'assets/tiles/torch.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.anims.create({
      key: 'hero-idle',
      frames: [
        { frame: 0, key: 'hero', duration: 5000 },
        ...this.anims.generateFrameNumbers('idle-spritesheet', {})
      ],
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-walk',
      frames: this.anims.generateFrameNumbers('walk-spritesheet', {}),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-run',
      frames: this.anims.generateFrameNumbers('run-spritesheet', {}),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-jump',
      frames: this.anims.generateFrameNumbers('jump-spritesheet', {}),
      frameRate: 6,
      repeat: 0
    });
    this.anims.create({
      key: 'hero-double-jump',
      frames: this.anims.generateFrameNumbers('double-jump-spritesheet', {}),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: 'hero-fall',
      frames: this.anims.generateFrameNumbers('fall-spritesheet', {}),
      frameRate: 10,//5
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-death',
      frames: this.anims.generateFrameNumbers('death-spritesheet', {}),
      frameRate: 10,//5
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-landing',
      frames: this.anims.generateFrameNumbers('landing-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-attack',
      frames: this.anims.generateFrameNumbers('attack-spritesheet', {}),
      frameRate: 10,//7
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-special-attack',
      frames: this.anims.generateFrameNumbers('special-attack-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-walk-attack',
      frames: this.anims.generateFrameNumbers('walk-attack-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-run-attack',
      frames: this.anims.generateFrameNumbers('run-attack-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: 'slash',
      frames: this.anims.generateFrameNumbers('slash-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'campfire',
      frames: this.anims.generateFrameNumbers('campfire', {}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'flag',
      frames: this.anims.generateFrameNumbers('flag', {}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'torch',
      frames: this.anims.generateFrameNumbers('torch', {}),
      frameRate: 10,
      repeat: -1,
    });

    this.map = this.make.tilemap({ key: 'level1-tilemap' });

    let heroX;
    let heroY;

    let objects = this.map.getObjectLayer('objects').objects;
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.name == 'StartHero') {
        heroX = object.x;
        heroY = object.y;
      }
    }

    this.background4 = this.map.addTilesetImage('wallpaper4', 'background4');
    this.background3 = this.map.addTilesetImage('wallpaper3', 'background3');
    this.background2 = this.map.addTilesetImage('wallpaper2', 'background2');
    this.background1 = this.map.addTilesetImage('wallpaper1', 'background1');

    this.battlegroundLayer1 = this.map.createStaticLayer('wallpaper1' /*layer name from json*/, this.background1);
    this.battlegroundLayer1.setScrollFactor(0.0, 1);
    this.battlegroundLayer2 = this.map.createStaticLayer('wallpaper2' /*layer name from json*/, this.background2);
    this.battlegroundLayer2.setScrollFactor(0.2, 1);
    this.battlegroundLayer3 = this.map.createStaticLayer('wallpaper3' /*layer name from json*/, this.background3);
    this.battlegroundLayer3.setScrollFactor(0.4, 1);
    this.battlegroundLayer4 = this.map.createStaticLayer('wallpaper4' /*layer name from json*/, this.background4);
    this.battlegroundLayer4.setScrollFactor(0.6, 1);

    this.groundTiles = this.map.addTilesetImage('ground', 'ground-image');
    this.bushTiles = this.map.addTilesetImage('bush', 'bush-image');
    this.rocksTiles = this.map.addTilesetImage('rocks', 'rocks-image');

    this.map.createStaticLayer('background' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles]);
    this.groundLayer = this.map.createStaticLayer('ground' /*layer name from json*/, this.groundTiles);

    let waterGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    this.hero = new Rogue(this, heroX, heroY, waterGroup);
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'water') {
        let water = waterGroup.create(object.x, object.y, 'ground-image', object.gid - this.groundTiles.firstgid);
        water.setOrigin(0, 1);
        water.body.setSize(32, 10);
        water.body.setOffset(0, 22);
        this.physics.add.collider(this.hero, waterGroup);
      }
    }

    let spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    this.entGroup = this.physics.add.group();

    let offX = 5;
    let offY = 13;
    let width = 32 - offX * 2;
    let height = 32 - offY;

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'spike') {
        let spike = spikeGroup.create(object.x, object.y, 'ground-image', object.gid - this.groundTiles.firstgid);
        spike.setOrigin(0, 1);
        spike.setAngle(object.rotation);

        if (object.rotation == 0 || object.rotation == 360) {
          spike.body.setSize(width, height);
          spike.body.setOffset(offX, offY);
        } else if (object.rotation == 90 || object.rotation == -270) {
          spike.body.setSize(height, width);
          spike.body.setOffset(32 - offY - height, 32 + offX);
        } else if (object.rotation == 180 || object.rotation == -180) {
          spike.body.setSize(width, height);
          spike.body.setOffset(- offX - width, 32 + (32 - offY - height));
        } else if (object.rotation == 270 || object.rotation == -90) {
          spike.body.setSize(height, width);
          spike.body.setOffset(- 32 + offY, 32 - offX - width);
        } else {
          console.error("spike at incorrect angle: " + object.rotation);
        }
      }
      if (object.type == 'campfire') {
        let campfire = this.physics.add.sprite(object.x, object.y, 'bush-image', object.gid - this.bushTiles.firstgid);
        campfire.setOrigin(0, 1);
        campfire.anims.play("campfire");
        campfire.body.immovable = true;
        campfire.body.setAllowGravity(false);
      }
      if (object.type == 'flag') {
        let flag = this.physics.add.sprite(object.x, object.y, 'bush-image', object.gid - this.bushTiles.firstgid);
        flag.setOrigin(0, 1);
        flag.anims.play("flag");
        flag.body.immovable = true;
        flag.body.setAllowGravity(false);
      }
      if (object.type == 'torch') {
        let torch = this.physics.add.sprite(object.x, object.y, 'bush-image', object.gid - this.bushTiles.firstgid);
        torch.setOrigin(0, 1);
        torch.anims.play("torch");
        torch.body.immovable = true;
        torch.body.setAllowGravity(false);
      }
      if (object.type == 'ent') {
        let ent = new Ent(this, object.x, object.y);
        this.physics.add.collider(ent, this.groundLayer, ent.groundColided, null, ent);
        ent.setName('ent-' + object.gid);
        this.entGroup.add(ent, false);
      }
    }

    this.map.createStaticLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles]);

    this.physics.add.collider(this.hero, this.groundLayer);
    this.groundLayer.setCollisionBetween(this.groundTiles.firstgid, this.groundTiles.firstgid + this.groundTiles.total, true);
    this.groundLayer.setCollisionBetween(this.bushTiles.firstgid, this.bushTiles.firstgid + this.bushTiles.total, true);
    this.groundLayer.setCollisionBetween(this.rocksTiles.firstgid, this.rocksTiles.firstgid + this.rocksTiles.total, true);

    this.physics.add.overlap(this.hero, spikeGroup, this.hero.kill, null, this.hero);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //ca să nu dea cu capul de cer
    this.physics.world.setBoundsCollision(true, true, false, true);

    // var debug = this.add.graphics();
    // this.groundLayer.renderDebug(debug, {});

  }


}

export default Level1;