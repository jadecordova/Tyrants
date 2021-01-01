import {Scene} from 'phaser';
import {CreateWalls, CreateObjects} from './utils';

class WorldScene extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'WorldScene'} );
    }

    preload() { }

    create()
    {
        // var test = this.physics.add.sprite( 100, 100, 'atlas-01', 'lamp-off-01.png' ); 

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

        // Player.
        this.player = this.physics.add.sprite( 200, 200, 'player', 6 );
        this.player.setCollideWorldBounds( true );
        this.physics.add.collider( this.player, world );

        // Player hit area.
        this.player.body.setSize( 36, 24 );
        this.player.body.setOffset( 14, 36 );

        // Forefront layer.
        // The layers are drawn in the order they are created.
        // By creating this layer AFTER the player, its elements will appear above the player.
        var above = map.createStaticLayer( 'Above', tiles, 0, 0 );

        CreateWalls( this, map, 'Collision' );
        CreateObjects( this, map, 'atlas-01', 'Lights' );
        CreateObjects( this, map, 'atlas-01', 'Objects' );

        // Input.
        this.cursors = this.input.keyboard.createCursorKeys();
        // Camera.
        this.cameras.main.setBounds( 0, 0, map.widthInPixels, map.heightInPixels );
        this.cameras.main.startFollow( this.player );
        this.cameras.main.roundPixels = true;

        // Animation.
        this.anims.create( {
            key: 'down',
            frames: this.anims.generateFrameNumbers( 'player', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            } ),
            frameRate: 10,
            repeat: -1
        } );
        this.anims.create( {
            key: 'up',
            frames: this.anims.generateFrameNumbers( 'player', {
                frames: [8, 9, 10, 11, 12, 13, 14, 15]
            } ),
            frameRate: 10,
            repeat: -1
        } );
        this.anims.create( {
            key: 'right',
            frames: this.anims.generateFrameNumbers( 'player', {
                frames: [16, 17, 18, 19, 20, 21, 22, 23]
            } ),
            frameRate: 10,
            repeat: -1
        } );
        this.anims.create( {
            key: 'left',
            frames: this.anims.generateFrameNumbers( 'player', {
                frames: [24, 25, 26, 27, 28, 29, 30, 31]
            } ),
            frameRate: 10,
            repeat: -1
        } );
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
        this.player.body.setVelocity( 0 );
        // Horizontal movement
        if ( this.cursors.left.isDown )
        {
            this.player.body.setVelocityX( -80 );
            this.player.anims.play( 'left', true );
        } else if ( this.cursors.right.isDown )
        {
            this.player.body.setVelocityX( 80 );
            this.player.anims.play( 'right', true );
        }
        // Vertical movement
        if ( this.cursors.up.isDown )
        {
            this.player.body.setVelocityY( -80 );
            this.player.anims.play( 'up', true );
        } else if ( this.cursors.down.isDown )
        {
            this.player.body.setVelocityY( 80 );
            this.player.anims.play( 'down', true );
        }

        if ( !this.cursors.up.isDown &&
            !this.cursors.down.isDown &&
            !this.cursors.right.isDown &&
            !this.cursors.left.isDown )
        {
            this.player.anims.stop();
        }
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