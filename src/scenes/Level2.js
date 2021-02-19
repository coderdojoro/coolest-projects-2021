
// @ts-check

import Phaser from 'phaser';
import Knight from '../entities/Knight.js';
import Hero from '../entities/Knight.js';

class Level2 extends Phaser.Scene {

  constructor() {
    super('Level2');
  }

  preload() {
    this.load.image('mage', 'assets/mage/mage.png');
    this.load.spritesheet('idle-spritesheet', 'assets/mage/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/mage/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('run-spritesheet', 'assets/mage/run.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/mage/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('double-jump-spritesheet', 'assets/mage/double-jump.png', { frameWidth: 171, frameHeight: 128 });

    this.load.tilemapTiledJSON('level1-tilemap', 'assets/level2-tilemap.json');

    this.load.image('ground-image', 'assets/tiles/level2-tiles.png ');
    this.load.image('bush-image', 'assets/tiles/level2-bush.png');
  }

  create() {


    this.anims.create({
      key: 'hero-idle',
      frames: [
        { frame: 0, key: 'mage', duration: 10000 },
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
      frameRate: 6,//20
      repeat: 0
    });

    let hero = new Knight(this, 400, 300);


    this.map = this.make.tilemap({ key: 'level1-tilemap' });
    this.groundTiles = this.map.addTilesetImage('ground', 'ground-image');
    this.bushTiles = this.map.addTilesetImage('bush', 'bush-image');

    this.map.createStaticLayer('background' /*layer name from json*/, [this.groundTiles, this.bushTiles]);
    this.groundLayer = this.map.createStaticLayer('ground' /*layer name from json*/, [this.groundTiles, this.bushTiles]);
    this.map.createStaticLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles]);

    this.children.moveTo(hero, this.children.getIndex(this.map.getLayer('ground').tilemapLayer));

    this.physics.add.collider(hero, this.groundLayer);
    this.groundLayer.setCollisionBetween(this.groundTiles.firstgid, this.groundTiles.firstgid + this.groundTiles.total, true);
    this.groundLayer.setCollisionBetween(this.bushTiles.firstgid, this.bushTiles.firstgid + this.bushTiles.total, true);

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