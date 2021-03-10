/// <reference path="../typings/phaser.d.ts" />
// @ts-check

import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#000000',
  scale: {
    width: 1280,
    height: 720,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true
    }
  }
};
