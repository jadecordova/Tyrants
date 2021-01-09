import 'phaser';
import BootScene from './BootScene';
import WorldScene from './WorldScene';
import BattleScene from './BattleScene';
import UIScene from './UIScene';


const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: window.innerWidth - 15,
    height: window.innerHeight - 15,
    zoom: 1,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '1c1c1c',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
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
