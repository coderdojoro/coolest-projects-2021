
// @ts-check

import Phaser from 'phaser';

class StartScreen extends Phaser.Scene {

  constructor() {
    super('StartScreen');
  }

  preload() {
    this.load.image('game-title', 'assets/start-screen/game-title.png');
    this.load.image('level1', 'assets/start-screen/level1.png');
    this.load.image('level1-glow', 'assets/start-screen/level1-glow.png');
    this.load.image('level2', 'assets/start-screen/level2.png');
    this.load.image('level2-glow', 'assets/start-screen/level2-glow.png');
    this.load.image('createdby', 'assets/start-screen/createdby.png');
    this.load.image('instructions', 'assets/start-screen/instructions.png');


  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#3E424B");
    this.add.image(640, 100, 'game-title');
    this.add.image(1030, 380, 'instructions');
    this.add.image(640, 680, 'createdby');

    let lvl1 = this.add.sprite(380, 320, 'level1').setInteractive();
    let lvl2 = this.add.sprite(380, 400, 'level2').setInteractive();

    lvl1.on(Phaser.Input.Events.POINTER_OVER, function (pointer) {
      lvl1.setTexture('level1-glow');
    });

    lvl1.on(Phaser.Input.Events.POINTER_OUT, function (pointer) {
      lvl1.setTexture('level1');
    });

    lvl1.once(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
      this.scene.start("Level1");
    }, this);

    lvl2.on(Phaser.Input.Events.POINTER_OVER, function (pointer) {
      lvl2.setTexture('level2-glow');
    });

    lvl2.on(Phaser.Input.Events.POINTER_OUT, function (pointer) {
      lvl2.setTexture('level2');
    });

    lvl2.once(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
      this.scene.start("Level2");
    }, this);

  }


}

export default StartScreen;