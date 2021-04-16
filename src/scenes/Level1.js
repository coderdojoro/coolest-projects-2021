
// @ts-check

import Phaser from 'phaser';
import Rogue from '../entities/Rogue.js';

class Level1 extends Phaser.Scene {

  constructor() {
    super('Level1');
  }

  preload() {
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

    this.battlegroundLayer1 = this.map.createLayer('wallpaper1' /*layer name from json*/, this.background1);
    this.battlegroundLayer1.setScrollFactor(0.0, 1);
    this.battlegroundLayer2 = this.map.createLayer('wallpaper2' /*layer name from json*/, this.background2);
    this.battlegroundLayer2.setScrollFactor(0.2, 1);
    this.battlegroundLayer3 = this.map.createLayer('wallpaper3' /*layer name from json*/, this.background3);
    this.battlegroundLayer3.setScrollFactor(0.4, 1);
    this.battlegroundLayer4 = this.map.createLayer('wallpaper4' /*layer name from json*/, this.background4);
    this.battlegroundLayer4.setScrollFactor(0.6, 1);

    this.groundTiles = this.map.addTilesetImage('ground', 'ground-image');
    this.bushTiles = this.map.addTilesetImage('bush', 'bush-image');
    this.rocksTiles = this.map.addTilesetImage('rocks', 'rocks-image');

    this.map.createLayer('background' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles]);
    this.groundLayer = this.map.createLayer('ground' /*layer name from json*/, this.groundTiles);

    let spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });

    let offX = 5;
    let offY = 13;
    let width = 32 - offX * 2;
    let height = 32 - offY;

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'spike') {
        let spike;
        if (object.gid == 363) {
          spike = spikeGroup.create(object.x, object.y, 'ground-image', 98);
        }
        if (object.gid == 364) {
          spike = spikeGroup.create(object.x, object.y, 'ground-image', 99);
        }
        if (object.gid == 365) {
          spike = spikeGroup.create(object.x, object.y, 'ground-image', 100);
        }
        if (object.gid == 366) {
          spike = spikeGroup.create(object.x, object.y, 'ground-image', 101);
        }
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
    }

    let waterGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    let hero = new Rogue(this, heroX, heroY, waterGroup);

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'water') {
        let water;
        if (object.gid == 272) {
          // water = this.physics.add.staticSprite(object.x, object.y, 'ground-image', 7);
          water = waterGroup.create(object.x, object.y, 'ground-image', 7);
        }
        if (object.gid == 282) {
          water = waterGroup.create(object.x, object.y, 'ground-image', 17);
        }
        if (object.gid == 300) {
          water = waterGroup.create(object.x, object.y, 'ground-image', 35);
        }
        if (object.gid == 326) {
          water = waterGroup.create(object.x, object.y, 'ground-image', 61);
        }
        if (object.gid == 344) {
          water = waterGroup.create(object.x, object.y, 'ground-image', 79);
        }

        water.setOrigin(0, 1);
        water.body.setSize(32, 10);
        water.body.setOffset(0, 22);
        this.physics.add.collider(hero, waterGroup);

      }
    }

    this.map.createLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles]);

    this.physics.add.collider(hero, this.groundLayer);
    this.groundLayer.setCollisionBetween(this.groundTiles.firstgid, this.groundTiles.firstgid + this.groundTiles.total, true);
    this.groundLayer.setCollisionBetween(this.bushTiles.firstgid, this.bushTiles.firstgid + this.bushTiles.total, true);
    this.groundLayer.setCollisionBetween(this.rocksTiles.firstgid, this.rocksTiles.firstgid + this.rocksTiles.total, true);

    this.physics.add.overlap(hero, spikeGroup, hero.kill, null, hero);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(hero);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //ca să nu dea cu capul de cer
    this.physics.world.setBoundsCollision(true, true, false, true);

    // var debug = this.add.graphics();
    // this.groundLayer.renderDebug(debug, {});

  }


}

export default Level1;