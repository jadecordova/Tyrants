import {Scene} from 'phaser';
import * as Utils from './utils';
import Player from './Player';

class WorldScene extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'WorldScene'} );

        // Message dialog.
        this.dialog;

        // Player direction.
        this.direction = 'down';

        // Coin tween - created in Utils.Gold().
        this.coinTween;
    }

    init( data )
    {
        // Get a reference to the Message scene.
        this.dialog = this.scene.get( 'Message' );
        this.data = data;
    }

    create()
    {

        //------------------------------------------------------------------------------------------------ WORLD LOWER LAYERS
        const map = this.make.tilemap( {key: 'map'} );

        // 'tiles' is the name given to the tileset in Tiled.
        const tiles = map.addTilesetImage( 'tiles', 'tiles' );

        // Tile layers.
        const below = map.createStaticLayer( 'Floor', tiles, 0, 0 );
        const world = map.createStaticLayer( 'Walls', tiles, 0, 0 );

        // World bounds.
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        this.walls = Utils.CreateZones( this, map, 'Collision' );
        this.lights = Utils.CreateObjects( this, map, 'atlas-01', 'Lights' );
        this.items = Utils.CreateObjects( this, map, 'atlas-01', 'Objects' );
        this.actions = Utils.CreateZones( this, map, 'Interactions' );


        //------------------------------------------------------------------------------------------------ FIRE
        this.fire = this.add.sprite( 355, 112, 'atlas-01', 'fire1_ 01.png' );
        this.anims.create( {
            key: 'fire',
            frames: this.anims.generateFrameNames( 'atlas-01', {prefix: 'fire1_ ', start: 1, end: 13, zeroPad: 2, suffix: '.png'} ),
            frameRate: 10,
            repeat: -1
        } );
        this.fire.anims.play( 'fire' );

        //------------------------------------------------------------------------------------------------ GIRL
        // Player.
        this.girl = new Player( {
            scene: this,
            x: 330,
            y: 140,
            texture: 'girl',
            frame: 0,
            type: 'heroe',
            hp: 50,
            damage: 5,
            width: 36,
            height: 24,
            offsetX: 14,
            offsetY: 36
        } );

        // Animation.
        Utils.CreateAnimations( this, 'girl' );


        //------------------------------------------------------------------------------------------------ COLLISION
        this.physics.add.overlap( this.girl, this.actions, false, false, this );
        this.physics.add.collider( this.girl, this.walls, false, false, this );
        this.items.forEach( element =>
        {
            this.physics.add.collider( this.girl, element, false, false, this );
        } );


        //------------------------------------------------------------------------------------------------ WORLD UPPER LAYER
        // The layers are drawn in the order they are created.
        // By creating this layer AFTER the player, its elements will appear above the player.
        var above = map.createStaticLayer( 'Above', tiles, 0, 0 );


        //------------------------------------------------------------------------------------------------ COIN
        this.coin = Utils.CreateCoin( this );
        this.coinText = Utils.CreateCoinText( this );

        //------------------------------------------------------------------------------------------------ INPUT
        this.cursors = this.input.keyboard.createCursorKeys();
        var keyObj = this.input.keyboard.addKey( 'Space' );  // Get key object

        // Check for space key down.
        keyObj.on( 'down', event =>
        {

            // Construct the actual collision zone for the player.
            let offset = this.girl.body.offset;
            let bounds = this.girl.getBounds();
            let player = new Phaser.Geom.Rectangle( bounds.x + offset.x, bounds.y + offset.y, bounds.width - offset.x * 2, bounds.height - offset.y );

            // Check for zone overlap.
            const activeObject = this.actions.getChildren().filter( zone =>
            {
                const rect = zone.getBounds();
                return Phaser.Geom.Rectangle.Overlaps( player, rect );
            } )

            // Messages and actions. 
            if ( activeObject.length === 1 )
            {
                let data = {
                    object: activeObject[0],
                    player: this.girl,
                    result: null,
                }

                if ( activeObject[0].type && activeObject[0].type == 'gold' && activeObject[0].parameter )
                {
                    this.doActions( null, data );
                }
                else
                {
                    this.scene.pause( 'WorldScene' );
                    this.scene.run( 'Message', data );
                }
            }
        } );


        //------------------------------------------------------------------------------------------------ CAMERA
        this.cameras.main.setBounds( 0, 0, map.widthInPixels, map.heightInPixels );
        this.cameras.main.startFollow( this.girl );
        this.cameras.main.roundPixels = true;


        //------------------------------------------------------------------------------------------------ DARKNESS
        // Black image (1px) to darken scenne.
        // Must scale it to cover the whole world.

        let darkness = this.add.image( 0, 0, 'black' ).setOrigin( 0, 0 ).setScale( this.physics.world.bounds.width, this.physics.world.bounds.height ).setAlpha( 0.98 );

        this.spotlight = this.make.sprite( {
            x: this.fire.x,
            y: this.fire.y,
            key: 'mask',
            add: false
        } );
        darkness.mask = new Phaser.Display.Masks.BitmapMask( this, this.spotlight );
        darkness.mask.invertAlpha = true;

        //------------------------------------------------------------------------------------------------ EVENTS
        this.events.on( Phaser.Scenes.Events.RESUME, this.doActions );
    }


    update( time, delta )
    {
        this.girl.body.setVelocity( 0 );

        if ( Boolean( this.cursors.left.isDown ) +
            Boolean( this.cursors.right.isDown ) +
            Boolean( this.cursors.down.isDown ) +
            Boolean( this.cursors.up.isDown ) == 1 )
        {
            // Horizontal movement
            if ( this.cursors.left.isDown )
            {
                this.girl.body.setVelocityX( -80 );
                this.girl.anims.play( 'left', true );
                this.direction = 'left';
            }
            else if ( this.cursors.right.isDown )
            {
                this.girl.body.setVelocityX( 80 );
                this.girl.anims.play( 'right', true );
                this.direction = 'right';
            }

            // Vertical movement
            if ( this.cursors.up.isDown )
            {
                this.girl.body.setVelocityY( -80 );
                this.girl.anims.play( 'up', true );
                this.direction = 'up';
            }
            else if ( this.cursors.down.isDown )
            {
                this.girl.body.setVelocityY( 80 );
                this.girl.anims.play( 'down', true );
                this.direction = 'down';
            }

            if ( !this.cursors.up.isDown &&
                !this.cursors.down.isDown &&
                !this.cursors.right.isDown &&
                !this.cursors.left.isDown )
            {
                this.girl.anims.play( this.direction + '-stop' );
                this.girl.anims.stop();
            }

            if ( this.girl.currentItem == 'fire' )
            {
                this.spotlight.x = this.girl.x;
                this.spotlight.y = this.girl.y;
            }
        }
        else
        {
            this.girl.anims.play( this.direction + '-stop' );
            this.girl.anims.stop();
        }
    }

    doActions( event, data ) 
    {

        if ( data.object.action !== undefined )
        {
            Utils[data.object.action]( data );
        }
    };
}

export default WorldScene;