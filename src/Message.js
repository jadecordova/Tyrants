import {Scene} from 'phaser';

class Message extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'Message'} );

        this.txt;
        this.message;
    }

    init( data )
    {
        this.txt = data.text;
    }

    create()
    {
        /*
        {
            fontFamily: 'Courier',
            fontSize: '16px',
            fontStyle: '',
            backgroundColor: null,
            color: '#fff',
            stroke: '#fff',
            strokeThickness: 0,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#000',
                blur: 0,
                stroke: false,
                fill: false
            },
            align: 'left',  // 'left'|'center'|'right'|'justify'
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            maxLines: 0,
            lineSpacing: 0,
            fixedWidth: 0,
            fixedHeight: 0,
            rtl: false,
            testString: '|MÉqgy',
            wordWrap: {
                width: null,
                callback: null,
                callbackScope: null,
                useAdvancedWrap: false
            },
            metrics: false
            // metrics: {
            //     ascent: 0,
            //     descent: 0,
            //     fontSize: 0
            // }
        }
        */

        const style = {
            fontFamily: 'textFont',
            fontSize: '24px',
            color: '#fff',
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#000',
                blur: 0.5,
            },
            align: 'center',
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            maxLines: 6,
            wordWrap: {
                width: 490,
                useAdvancedWrap: true
            },
        }

        this.originX = window.innerWidth / 2;
        this.originY = window.innerHeight / 2;
        this.active = false;

        this.background = this.add.image( this.originX, this.originY, 'dialog' );
        this.background.alpha = 0.5;

        this.message = this.add.text( this.originX, this.originY, this.txt, style );
        this.message.align = 1;
        this.message.setOrigin( 0.5 );

        var keyObj = this.input.keyboard.addKey( 'Space' );  // Get key object

        // Check for space key down.
        keyObj.on( 'down', event =>
        {
            this.scene.resume( 'WorldScene' );
            this.scene.sleep( 'Message' );
        } );

        this.events.on( Phaser.Scenes.Events.WAKE, ( strageThings, data ) =>
        {
            this.message.text = data.text;
        } );
    }
}

export default Message;