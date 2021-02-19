import Phaser from 'phaser';
import config from './config';
import Level1 from './scenes/Level1';
import Level2 from './scenes/Level2';

new Phaser.Game(Object.assign(config, {
  scene: [Level1, Level2],
}));
