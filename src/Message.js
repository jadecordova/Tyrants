import 'phaser';

export default class Message extends Phaser.GameObjects.Container
{

    constructor( scene, width, height )
    {
        super( scene, 0, 0 );

        this.textPadding = 10;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.rectOriginX = 20;
        this.rectOriginY = this.screenHeight - 120;
        this.rectWidth = this.screenWidth - 50;
        this.rectHeight = 80;
        this.textOriginX = this.rectOriginX + this.textPadding;
        this.textOriginY = this.rectOriginY + this.textPadding;
        this.active = false;

        this.background = scene.add.image( this.screenWidth / 2, this.screenHeight / 2, 'dialog' );
        this.background.alpha = 0.7;
        this.add( this.background );
        //map.widthInPixels
        this.text = scene.add.bitmapText( this.textOriginX, this.textOriginY, 'textFont', '' ).setOrigin( 0.5 ).setScale( 0.5 );
        this.add( this.text );
        this.text.setOrigin( 0 );
        this.visible = false;

        scene.add.existing( this );
    }

    showMessage( text )
    {
        this.text.setText( text );
        this.visible = true;
        this.active = true;
        /*
        if ( this.hideEvent )
            this.hideEvent.remove( false );
        this.hideEvent = this.scene.time.addEvent( {delay: 2000, callback: this.hideMessage, callbackScope: this} );
        */
    }
    hideMessage()
    {
        // this.hideEvent = null;
        this.visible = false;
        this.active = false;
    }
}