import {Scene} from 'phaser';
import * as Utils from './utils';
import Message from './Message';
import Player from './Player';

class WorldScene extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'WorldScene'} );
    }

    preload() { }

    create()
    {

        //------------------------------------------------------------------------------------------------ WORLD LOWER LAYERS
        // Map.
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
        // Collisions.
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

            // Hide message.
            if ( this.message.active )
            {
                this.message.hideMessage();
            }

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

                this.message.showMessage( activeObject[0].message );
            }

        } );

        //------------------------------------------------------------------------------------------------ CAMERA
        this.cameras.main.setBounds( 0, 0, map.widthInPixels, map.heightInPixels );
        this.cameras.main.startFollow( this.girl );
        this.cameras.main.roundPixels = true;

        //------------------------------------------------------------------------------------------------ DARKNESS
        // Black image (1px) to darken scenne.
        // Must scale it to cover the whole world.
        let darkness = this.add.image( 0, 0, 'black' ).setOrigin( 0, 0 ).setScale( this.physics.world.bounds.width, this.physics.world.bounds.height ).setAlpha( 0.85 );

        this.spotlight = this.make.sprite( {
            x: this.girl.x,
            y: this.girl.y,
            key: 'mask',
            add: false
        } );
        darkness.mask = new Phaser.Display.Masks.BitmapMask( this, this.spotlight );
        darkness.mask.invertAlpha = true;

        // Create message object.
        this.message = new Message( this, map.widthInPixels, map.heightInPixels )


        /*
                this.spawns = this.physics.add.group( {
                    classType: Phaser.GameObjects.Zone
                } );
                for ( var i = 0; i < 10; i++ )
                {
                    var x = Phaser.Math.RND.between( 0, this.physics.world.bounds.width );
                    var y = Phaser.Math.RND.between( 0, this.physics.world.bounds.height );
                    // parameters are x, y, width, height
                    this.spawns.create( x, y, 64, 64 );
                }
                this.physics.add.overlap( this.player, this.spawns, this.onMeetEnemy, false, this );
        this.sys.events.on( 'wake', this.wake, this );
        */
        /*
        this.add.text( 128, 128, 'This is a test.', {
            fontFamily: 'textFont',
            fontSize: 24
        } );
        */
    }

    ActionsHandler( player, object )
    {
        const m = new Message( this, object.message );
    }

    wake()
    {
        this.cursors.left.reset();
        this.cursors.right.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    }

    update( time, delta )
    {
        this.girl.body.setVelocity( 0 );
        // Horizontal movement
        if ( this.cursors.left.isDown )
        {
            this.message.hideMessage();
            this.girl.body.setVelocityX( -80 );
            this.girl.anims.play( 'left', true );
        } else if ( this.cursors.right.isDown )
        {
            this.message.hideMessage();
            this.girl.body.setVelocityX( 80 );
            this.girl.anims.play( 'right', true );
        }
        // Vertical movement
        if ( this.cursors.up.isDown )
        {
            this.message.hideMessage();
            this.girl.body.setVelocityY( -80 );
            this.girl.anims.play( 'up', true );
        } else if ( this.cursors.down.isDown )
        {
            this.message.hideMessage();
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

    onMeetEnemy( player, zone )
    {
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between( 0, this.physics.world.bounds.width );
        zone.y = Phaser.Math.RND.between( 0, this.physics.world.bounds.height );

        // shake the world
        this.cameras.main.shake( 300 );

        // switch to BattleScene
        this.scene.switch( 'BattleScene' );
    }


}

export default WorldScene;