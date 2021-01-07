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

        // Level tiles.
        this.load.image( 'tiles', 'assets/tiles/level-01.png' );
        this.load.tilemapTiledJSON( 'map', 'assets/tilemaps/level-01.json' );

        this.load.spritesheet( 'player', 'assets/characters/cellist.png', {frameWidth: 64, frameHeight: 64} );

        // Images.
        this.load.image( 'mask', 'assets/images/lightmask.png' );
        this.load.image( 'black', 'assets/images/black.png' );

        // Fonts.
        this.load.bitmapFont( 'textFont', 'assets/fonts/textFont4_0.png', 'assets/fonts/textFont4.fnt' );

    }

    create()
    {
        this.scene.start( 'WorldScene' );
    }
}

export default BootScene;