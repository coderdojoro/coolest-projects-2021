
// @ts-check

import Phaser from 'phaser';
import Level1 from './Level1';
import Level2 from './Level2';

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
    this.load.image('createdby', 'assets/start-screen/createdby-small.png');
    this.load.image('instructions', 'assets/start-screen/instructions.png');
    this.load.image('logo-coolest-projects', 'assets/start-screen/logo-coolest-projects.png');
  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#3E424B');

    let rectangle = this.add.rectangle(880, 100, 390, 500, 0x464a53);
    rectangle.setOrigin(0, 0);

    this.add.image(620, 140, 'game-title');
    this.add.image(1075, 350, 'instructions');
    this.add.image(640, 680, 'createdby');
    this.add.image(140, 150, 'logo-coolest-projects');

    let text = this.add.text(-500, -500, 'Preload checkpoint font');
    text.setFontFamily('Stick');

    let lvl1 = this.add.sprite(420, 390, 'level1').setInteractive();
    let lvl2 = this.add.sprite(420, 470, 'level2').setInteractive();

    lvl1.on(Phaser.Input.Events.POINTER_OVER, function (pointer) {
      lvl1.setTexture('level1-glow');
    });

    lvl1.on(Phaser.Input.Events.POINTER_OUT, function (pointer) {
      lvl1.setTexture('level1');
    });

    lvl1.once(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
      this.scene.add('Level1', Level1);
      this.scene.start('Level1');
    }, this);

    lvl2.on(Phaser.Input.Events.POINTER_OVER, function (pointer) {
      lvl2.setTexture('level2-glow');
    });

    lvl2.on(Phaser.Input.Events.POINTER_OUT, function (pointer) {
      lvl2.setTexture('level2');
    });

    lvl2.once(Phaser.Input.Events.POINTER_DOWN, function (pointer) {
      this.scene.add('Level2', Level2);
      this.scene.start('Level2');
    }, this);

  }
}

export default StartScreen;