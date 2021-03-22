
// @ts-check

import Phaser from 'phaser';
import Knight from '../entities/Knight.js';
import Wolf from '../entities/Wolf.js';

class Level2 extends Phaser.Scene {

  constructor() {
    super('Level2');
  }

  preload() {
    this.load.tilemapTiledJSON('level1-tilemap', 'assets/level2-tilemap.json');

    this.load.image('ground-image', 'assets/tiles/level2-tiles.png');
    this.load.spritesheet('bush-image', 'assets/tiles/level2-bush.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image('trees-image', 'assets/tiles/level2-trees.png');

    this.load.image('background4', 'assets/wallpapers/snowy-forest/background4.png');
    this.load.image('background3', 'assets/wallpapers/snowy-forest/background3.png');
    this.load.image('background2', 'assets/wallpapers/snowy-forest/background2.png');
    this.load.image('background1', 'assets/wallpapers/snowy-forest/background1.png');

    this.load.spritesheet('brazier', 'assets/tiles/brazier.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('banner', 'assets/tiles/banner.png', { frameWidth: 32, frameHeight: 64 });
  }

  create() {
    this.anims.create({
      key: 'brazier',
      frames: this.anims.generateFrameNumbers('brazier', {}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'banner',
      frames: this.anims.generateFrameNumbers('banner', {}),
      frameRate: 10,
      repeat: -1,
    });

    this.map = this.make.tilemap({ key: 'level1-tilemap' });

    let heroX;
    let heroY;

    let objects = this.map.getObjectLayer('Objects').objects;
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
    this.treesTiles = this.map.addTilesetImage('trees', 'trees-image');

    let backgroundLayer = this.map.createStaticLayer('background' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.treesTiles]);
    this.groundLayer = this.map.createStaticLayer('ground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.treesTiles]);
    this.hero = new Knight(this, heroX, heroY);

    let spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });

    let offX = 5;
    let offY = 8
    let width = 32 - offX * 2;
    let height = 32 - offY;

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'spike') {
        let spike = spikeGroup.create(object.x, object.y, 'bush-image', object.gid - this.bushTiles.firstgid);
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
      if (object.type == 'brazier') {
        let brazier = this.physics.add.sprite(object.x, object.y, 'bush-image', object.gid - this.bushTiles.firstgid);
        brazier.setOrigin(0, 1);
        brazier.anims.play("brazier");
        brazier.body.immovable = true;
        brazier.body.setAllowGravity(false);
        brazier.setScale(2);
      }
      if (object.type == 'banner') {
        let banner = this.physics.add.sprite(object.x, object.y, 'bush-image', object.gid - this.bushTiles.firstgid);
        banner.setOrigin(0, 1);
        banner.anims.play("banner");
        banner.body.immovable = true;
        banner.body.setAllowGravity(false);
        banner.setScale(3);
      }
      if (object.type == 'wolf') {
        let wolf = new Wolf(this, object.x, object.y);
        this.physics.add.collider(wolf, this.groundLayer, wolf.groundColided, null, wolf);
        wolf.setName('wolf-' + object.id);
      }
    }

    this.map.createStaticLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.treesTiles]);

    this.physics.add.overlap(this.hero, backgroundLayer, this.hero.onBackgroundOverlap, null, this.hero);
    this.physics.add.collider(this.hero, this.groundLayer, this.hero.onGroundColided, null, this.hero);
    this.groundLayer.setCollisionBetween(this.groundTiles.firstgid, this.groundTiles.firstgid + this.groundTiles.total, true);
    this.groundLayer.setCollisionBetween(this.bushTiles.firstgid, this.bushTiles.firstgid + this.bushTiles.total, true);
    this.groundLayer.setCollisionBetween(this.treesTiles.firstgid, this.treesTiles.firstgid + this.treesTiles.total, true);

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

export default Level2;