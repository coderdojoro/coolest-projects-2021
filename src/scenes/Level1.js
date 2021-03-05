
// @ts-check

import Phaser from 'phaser';
import Rogue from '../entities/Rogue.js';

class Level1 extends Phaser.Scene {

  constructor() {
    super('Level1');
  }

  preload() {
    this.load.image('hero', 'assets/rogue/rogue.png');
    this.load.spritesheet('idle-spritesheet', 'assets/rogue/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/rogue/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/rogue/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('double-jump-spritesheet', 'assets/rogue/double-jump.png', { frameWidth: 171, frameHeight: 128 });

    this.load.tilemapTiledJSON('level1-tilemap', 'assets/level1-tilemap.json');

    //this.load.image('ground-image', 'assets/tiles/level1-tiles.png ');
    this.load.spritesheet('ground-image', 'assets/tiles/level1-tiles.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.image('bush-image', 'assets/tiles/level1-bush.png');
    this.load.image('rocks-image', 'assets/tiles/level1-rocks.png');

    this.load.image('background4', 'assets/wallpapers/forest/background4.png');
    this.load.image('background3', 'assets/wallpapers/forest/background3.png');
    this.load.image('background2', 'assets/wallpapers/forest/background2.png');
    this.load.image('background1', 'assets/wallpapers/forest/background1.png');

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
      key: 'hero-jump',
      frames: this.anims.generateFrameNumbers('jump-spritesheet', {}),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-double-jump',
      frames: this.anims.generateFrameNumbers('double-jump-spritesheet', {}),
      frameRate: 20,
      repeat: 0
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
    let hero = new Rogue(this, 100, 300, waterGroup);

    let objects = this.map.getObjectLayer('objects').objects;

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

    this.map.createStaticLayer('foreground' /*layer name from json*/, [this.groundTiles, this.bushTiles, this.rocksTiles]);

    this.children.moveTo(hero, this.children.getIndex(this.map.getLayer('ground').tilemapLayer));

    this.physics.add.collider(hero, this.groundLayer);
    this.groundLayer.setCollisionBetween(this.groundTiles.firstgid, this.groundTiles.firstgid + this.groundTiles.total, true);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(hero);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //ca să nu dea cu capul de cer
    this.physics.world.setBoundsCollision(true, true, false, true);


    //var debug = this.add.graphics();
    //this.groundLayer.renderDebug(debug, {});


  }


}

export default Level1;