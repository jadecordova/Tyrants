import {Scene} from 'phaser';
import * as Utils from './utils';
import Player from './Player';

class WorldScene extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'WorldScene'} );

        this.dialog;
    }

    init()
    {
        // Get a reference to the Message scene.
        this.dialog = this.scene.get( 'Message' );

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


        //------------------------------------------------------------------------------------------------ GIRL
        // Player.
        this.girl = new Player( {
            scene: this,
            x: 200,
            y: 200,
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
                this.scene.pause( 'WorldScene' );
                this.scene.run( 'Message', {
                    text: activeObject[0].message,
                    action: activeObject[0].action,
                    parameter: activeObject[0].parameter
                } );
                //
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
            x: this.girl.x,
            y: this.girl.y,
            key: 'mask',
            add: false
        } );
        darkness.mask = new Phaser.Display.Masks.BitmapMask( this, this.spotlight );
        darkness.mask.invertAlpha = true;


        //------------------------------------------------------------------------------------------------ EVENTS
        this.events.on( Phaser.Scenes.Events.RESUME, ( strangeThings, data ) =>
        {
            console.log( data.gold );
            if ( data.action !== undefined )
            {
                Utils[data.action]( data.parameter );
            }
        } );
    }


    update( time, delta )
    {
        this.girl.body.setVelocity( 0 );
        // Horizontal movement
        if ( this.cursors.left.isDown )
        {
            //this.message.hideMessage();
            this.girl.body.setVelocityX( -80 );
            this.girl.anims.play( 'left', true );
        } else if ( this.cursors.right.isDown )
        {
            //this.message.hideMessage();
            this.girl.body.setVelocityX( 80 );
            this.girl.anims.play( 'right', true );
        }
        // Vertical movement
        if ( this.cursors.up.isDown )
        {
            //this.message.hideMessage();
            this.girl.body.setVelocityY( -80 );
            this.girl.anims.play( 'up', true );
        } else if ( this.cursors.down.isDown )
        {
            //this.message.hideMessage();
            this.girl.body.setVelocityY( 80 );
            this.girl.anims.play( 'down', true );
        }

        if ( !this.cursors.up.isDown &&
            !this.cursors.down.isDown &&
            !this.cursors.right.isDown &&
            !this.cursors.left.isDown )
        {
            this.girl.anims.stop();
        }

        this.spotlight.x = this.girl.x;
        this.spotlight.y = this.girl.y;
    }
}

export default WorldScene;