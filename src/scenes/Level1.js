
// @ts-check

import Phaser from 'phaser';
import Ent from '../entities/Ent.js';
import Rogue from '../entities/Rogue.js';
import Spider from '../entities/Spider.js';

class Level1 extends Phaser.Scene {

  constructor() {
    super('Level1');
  }

  preload() {
    this.load.tilemapTiledJSON('level1-tilemap', 'assets/level1-tilemap.json');

    this.load.spritesheet('lvl1-ground-image', 'assets/tiles/level1-tiles.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('lvl1-bush-image', 'assets/tiles/level1-bush.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('lvl1-rocks-image', 'assets/tiles/level1-rocks.png');
    this.load.image('lvl1-hut-image', 'assets/tiles/level1-hut.png');

    this.load.image('lvl1-background4', 'assets/wallpapers/forest/background4.png');
    this.load.image('lvl1-background3', 'assets/wallpapers/forest/background3.png');
    this.load.image('lvl1-background2', 'assets/wallpapers/forest/background2.png');
    this.load.image('lvl1-background1', 'assets/wallpapers/forest/background1.png');

    this.load.spritesheet('campfire', 'assets/tiles/campfire.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('flag', 'assets/tiles/flag.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('torch', 'assets/tiles/torch.png', { frameWidth: 32, frameHeight: 32 });

    this.load.audio('music-lvl1', 'assets/music-lvl1.mp3');
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
    let heroFinishX;
    let heroFinishY;

    let objects = this.map.getObjectLayer('Objects').objects;
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.name == 'StartHero') {
        heroX = object.x;
        heroY = object.y;
      }
      if (object.name == 'EndHero') {
        heroFinishX = object.x;
        heroFinishY = object.y;
      }
    }

    this.background4 = this.map.addTilesetImage('wallpaper4', 'lvl1-background4');
    this.background3 = this.map.addTilesetImage('wallpaper3', 'lvl1-background3');
    this.background2 = this.map.addTilesetImage('wallpaper2', 'lvl1-background2');
    this.background1 = this.map.addTilesetImage('wallpaper1', 'lvl1-background1');

    this.battlegroundLayer1 = this.map.createLayer('wallpaper1' /*layer name from json*/, this.background1);
    this.battlegroundLayer1.setScrollFactor(0.0, 1);
    this.battlegroundLayer2 = this.map.createLayer('wallpaper2' /*layer name from json*/, this.background2);
    this.battlegroundLayer2.setScrollFactor(0.2, 1);
    this.battlegroundLayer3 = this.map.createLayer('wallpaper3' /*layer name from json*/, this.background3);
    this.battlegroundLayer3.setScrollFactor(0.4, 1);
    this.battlegroundLayer4 = this.map.createLayer('wallpaper4' /*layer name from json*/, this.background4);
    this.battlegroundLayer4.setScrollFactor(0.6, 1);

    this.groundTiles = this.map.addTilesetImage('ground', 'lvl1-ground-image');
    this.bushTiles = this.map.addTilesetImage('bush', 'lvl1-bush-image');
    this.rocksTiles = this.map.addTilesetImage('rocks', 'lvl1-rocks-image');
    this.hutTiles = this.map.addTilesetImage('hut', 'lvl1-hut-image');

    let backgroundLayer = this.map.createLayer('background' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles, this.hutTiles]);
    this.groundLayer = this.map.createLayer('ground' /*layer name from json*/, this.groundTiles);

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'torch') {
        let torch = this.physics.add.sprite(object.x, object.y, 'lvl1-bush-image', object.gid - this.bushTiles.firstgid);
        torch.setOrigin(0, 1);
        torch.anims.play('torch');
        torch.body.immovable = true;
        torch.body.setAllowGravity(false);
      }
    }

    let waterGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    this.hero = new Rogue(this, heroX, heroY, heroFinishX, heroFinishY, waterGroup);
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'water') {
        let water = waterGroup.create(object.x, object.y, 'lvl1-ground-image', object.gid - this.groundTiles.firstgid);
        water.setOrigin(0, 1);
        water.body.setSize(32, 10);
        water.body.setOffset(0, 22);
        this.physics.add.collider(this.hero, waterGroup);
      }
    }

    let spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    this.entGroup = this.physics.add.group({ allowGravity: false });
    this.spiderGroup = this.physics.add.group({ allowGravity: false });

    let offX = 5;
    let offY = 13;
    let width = 32 - offX * 2;
    let height = 32 - offY;

    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.type == 'spike') {
        let spike = spikeGroup.create(object.x, object.y, 'lvl1-ground-image', object.gid - this.groundTiles.firstgid);
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
          console.error('spike at incorrect angle: ' + object.rotation);
        }
      }
      if (object.type == 'campfire') {
        let campfire = this.physics.add.sprite(object.x, object.y, 'lvl1-bush-image', object.gid - this.bushTiles.firstgid);
        campfire.setOrigin(0, 1);
        campfire.anims.play({ key: 'campfire', startFrame: Phaser.Math.Between(0, 5) });
        campfire.body.immovable = true;
        campfire.body.setAllowGravity(false);
      }
      if (object.type == 'flag') {
        let flag = this.physics.add.sprite(object.x, object.y, 'lvl1-bush-image', object.gid - this.bushTiles.firstgid);
        flag.setOrigin(0, 1);
        flag.anims.play('flag');
        flag.body.immovable = true;
        flag.body.setAllowGravity(false);
      }
      if (object.type == 'ent') {
        let ent = new Ent(this, object.x, object.y);
        this.physics.add.collider(ent, this.groundLayer, ent.groundColided, null, ent);
        ent.setName('ent-' + object.id);
        this.entGroup.add(ent, false);
      }
      if (object.type == 'spider') {
        let spider = new Spider(this, object.x, object.y);
        this.physics.add.collider(spider, this.groundLayer, spider.groundColided, null, spider);
        spider.setName('ent-' + object.id);
        this.spiderGroup.add(spider, false);
      }
    }

    this.map.createLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles]);

    this.physics.add.overlap(this.hero, backgroundLayer, this.hero.onBackgroundOverlap, null, this.hero);
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

    this.music = this.sound.add('music-lvl1', {
      loop: true,
      volume: 0.1
    });
    this.music.play();

    // var debug = this.add.graphics();
    // this.groundLayer.renderDebug(debug, {});
  }

  finish() {
    this.music.stop();
    this.scene.start('StartScreen');
    this.scene.remove();
  }
}

export default Level1;