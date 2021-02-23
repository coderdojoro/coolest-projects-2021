
// @ts-check

import Phaser from 'phaser';
import Knight from '../entities/Knight.js';
import Hero from '../entities/Knight.js';

class Level2 extends Phaser.Scene {

  constructor() {
    super('Level2');
  }

  preload() {
    this.load.image('hero', 'assets/knight/knight.png');
    this.load.spritesheet('idle-spritesheet', 'assets/knight/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/knight/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('run-spritesheet', 'assets/knight/run.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/knight/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('double-jump-spritesheet', 'assets/knight/double-jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('fall-spritesheet', 'assets/knight/fall.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('death-spritesheet', 'assets/knight/death.png', { frameWidth: 171, frameHeight: 128 });

    this.load.tilemapTiledJSON('level1-tilemap', 'assets/level2-tilemap.json');

    this.load.image('ground-image', 'assets/tiles/level2-tiles.png ');
    //this.load.image('bush-image', 'assets/tiles/level2-bush.png');
    this.load.spritesheet('bush-image', 'assets/tiles/level2-bush.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image('trees-image', 'assets/tiles/level2-trees.png');

    this.load.image('background4', 'assets/wallpapers/snowy-forest/background4.png');
    this.load.image('background3', 'assets/wallpapers/snowy-forest/background3.png');
    this.load.image('background2', 'assets/wallpapers/snowy-forest/background2.png');
    this.load.image('background1', 'assets/wallpapers/snowy-forest/background1.png');

  }

  create() {


    this.anims.create({
      key: 'hero-idle',
      frames: [
        { frame: 0, key: 'hero', duration: 10000 },
        ...this.anims.generateFrameNumbers('idle-spritesheet', {})
      ],
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-walk',
      frames: this.anims.generateFrameNumbers("walk-spritesheet", {}),
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
      frames: this.anims.generateFrameNumbers("jump-spritesheet", {}),
      frameRate: 6,
      repeat: 0
    });
    this.anims.create({
      key: 'hero-double-jump',
      frames: this.anims.generateFrameNumbers("double-jump-spritesheet", {}),
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

    this.map.createStaticLayer('background' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.treesTiles]);
    this.groundLayer = this.map.createStaticLayer('ground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.treesTiles]);

    let spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });

    let offX = 5;
    let offY = 8
    let width = 32 - offX * 2;
    let height = 32 - offY;

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'spike') {
        let spike = spikeGroup.create(object.x, object.y, 'bush-image', 276);
        spike.setOrigin(0, 1);
        spike.setAngle(object.rotation);
        if (object.rotation == 0) {
          spike.body.setSize(width, height);
          spike.body.setOffset(offX, offY);
        } else if (object.rotation == 90) {
          spike.body.setSize(height, width);
          spike.body.setOffset(32 - offY - height, 32 + offX);
        } else if (object.rotation == 180) {
          spike.body.setSize(width, height);
          spike.body.setOffset(- offX - width, 32 + (32 - offY - height));
        } else if (object.rotation == 270) {
          spike.body.setSize(height, width);
          spike.body.setOffset(- 32 + offY + height - width, 32 - offX - width);
        } else {
          console.error("spike at incorrect angle: " + object.rotation);
        }
      }
    }
    let hero = new Knight(this, heroX, heroY);
    this.map.createStaticLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.treesTiles]);

    //this.children.moveTo(hero, this.children.getIndex(this.map.getLayer('ground').tilemapLayer));

    this.physics.add.collider(hero, this.groundLayer, hero.colided, null, hero);
    this.groundLayer.setCollisionBetween(this.groundTiles.firstgid, this.groundTiles.firstgid + this.groundTiles.total, true);
    this.groundLayer.setCollisionBetween(this.bushTiles.firstgid, this.bushTiles.firstgid + this.bushTiles.total, true);
    this.groundLayer.setCollisionBetween(this.treesTiles.firstgid, this.treesTiles.firstgid + this.treesTiles.total, true);

    this.physics.add.overlap(hero, spikeGroup, hero.kill, null, hero);


    // for (let a = this.groundTiles.firstgid; a < this.groundTiles.firstgid + this.groundTiles.total; a++) {
    //   if (this.groundTiles.getTileProperties(a)) {
    //     console.log(this.groundTiles.getTileProperties(a));
    //     console.log(a);
    //     this.groundLayer.setTileIndexCallback(a, function (f) {
    //       console.log(f);
    //     }, this);
    //   }
    // }

    // this.map.forEachTile(function (pTile) {
    //   console.log(pTile.properties);
    // });

    // console.log(this.map);


    // this.groundLayer.forEachTile(function (tile) {
    //   console.log(tile.properties.annotation);
    // });

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(hero);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //ca să nu dea cu capul de cer
    this.physics.world.setBoundsCollision(true, true, false, true);

    //var debug = this.add.graphics();
    // this.groundLayer.renderDebug(debug, {});

  }


}

export default Level2;