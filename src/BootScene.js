import {Scene} from 'phaser';

class BootScene extends Phaser.Scene
{

    constructor()
    {
        super( {key: 'BootScene'} );
    }

    preload()
    {
        // Level objects.
        this.load.multiatlas( 'atlas-01', 'assets/atlas/objects-01.json' );

        // Level tiles
        this.load.image( 'tiles', 'assets/tiles/level-01.png' );
        this.load.tilemapTiledJSON( 'map', 'assets/tilemaps/level-01.json' );

        //this.load.multiatlas( 'level-01-objects-atlas', 'assets/tilemaps/obj-level-01.json' );
        this.load.spritesheet( 'player', 'assets/characters/cellist.png', {frameWidth: 64, frameHeight: 64} );
    }

    create()
    {
        this.scene.start( 'WorldScene' );
    }
}

export default BootScene;