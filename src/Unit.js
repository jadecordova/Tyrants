import 'phaser';

export default class Unit extends Phaser.GameObjects.Sprite
{
    constructor( config )
    {
        super( config.scene, config.x, config.y, config.texture, config.frame );

        this.type = config.type;
        this.hp = config.hp;
        this.maxHp = config.hp;
        this.damage = config.damage;
        this.name = config.name;

        config.scene.add.existing( this );
        config.scene.physics.add.existing( this );

        // World bounds collision.
        this.body.setCollideWorldBounds( true )

        // Player hit area.
        this.body.setSize( config.width, config.height ); // 36, 24
        this.body.setOffset( config.offsetX, config.offsetY ); // 14, 36
    }

    attack( target )
    {
        target.takeDamage( this.damage );
    }

    takeDamage( damage )
    {
        this.hp -= damage;
    }
}
