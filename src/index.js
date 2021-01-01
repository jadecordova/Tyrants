import 'phaser';
import BootScene from './BootScene';
import WorldScene from './WorldScene';
import BattleScene from './BattleScene';
import UIScene from './UIScene';

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    zoom: 1,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: true
        }
    }
    ,
    scene: [
        BootScene,
        WorldScene,
        BattleScene,
        UIScene
    ]
};

var game = new Phaser.Game( config );
