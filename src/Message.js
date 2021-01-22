import {Scene} from 'phaser';

class Message extends Phaser.Scene
{
    constructor()
    {
        super( {key: 'Message'} );

        this.message;
    }

    init( data )
    {
        this.data = data;
        this.data.result = 1;

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

        this.messageStyle = {
            fontFamily: 'textFont',
            fontSize: '24px',
            color: '#fff',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 0.2,
                fill: true
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
        this.onStyle = {
            fontFamily: 'textFont',
            fontSize: '18px',
            color: '#0',
            align: 'center',
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        }
        this.offStyle = {
            fontFamily: 'textFont',
            fontSize: '18px',
            color: '#999',
            align: 'center',
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        }

        this.originX = window.innerWidth / 2;
        this.originY = window.innerHeight / 2;
        this.active = false;

        var spaceKey = this.input.keyboard.addKey( 'Space' );
        var leftKey = this.input.keyboard.addKey( 'left' );
        var rightKey = this.input.keyboard.addKey( 'right' );

        // Check for key down.
        spaceKey.on( 'down', event =>
        {
            this.scene.resume( 'WorldScene', this.data );
            this.scene.sleep( 'Message' );
        } );

        leftKey.on( 'down', event =>
        {
            if ( this.data.object.action !== undefined )
            {
                if ( this.data.result === 0 )
                {
                    this.setState( 'yes' );
                }
            }
        } );

        rightKey.on( 'down', event =>
        {
            if ( this.data.object.action !== undefined )
            {
                if ( this.data.result === 1 )
                {
                    this.setState( 'no' );
                }
            }
        } );

        this.events.on( Phaser.Scenes.Events.WAKE, ( event, data ) =>
        {
            this.data = data;
            this.message.text = this.data.object.message;
            this.setState( 'yes' );

            if ( this.data.object.action == undefined )
            {
                this.hideButtons();
            }
            else
            {
                this.showButtons();
            }
        } );

    }

    create()
    {

        this.background = this.add.image( this.originX, this.originY, 'atlas-01', 'dialog.png' );
        this.background.alpha = 0.5;

        this.message = this.add.text( this.originX, this.originY, this.data.object.message, this.messageStyle );
        this.message.align = 1;
        this.message.setOrigin( 0.5 );

        this.buttonYES = this.add.image( this.originX, this.originY + 120, 'atlas-01', 'yes.png' );
        this.buttonNO = this.add.image( this.originX, this.originY + 120, 'atlas-01', 'no.png' );
        this.buttonYES.visible = false;
        this.buttonNO.visible = false;

        this.yes = this.add.text( this.originX - 75, this.originY + 110, 'Yes', this.onStyle );
        this.no = this.add.text( this.originX + 30, this.originY + 110, 'No', this.offStyle );
        this.yes.visible = false;
        this.no.visible = false;

        if ( this.data.object.action == undefined )
        {
            this.hideButtons();
        }
        else
        {
            this.showButtons();
        }
    }

    setState( state )
    {
        if ( state === 'yes' )
        {
            this.buttonYES.visible = true;
            this.buttonNO.visible = false;
            this.yes.setStyle( this.onStyle );
            this.no.setStyle( this.offStyle );
            this.data.result = 1;
        }
        else
        {
            this.buttonYES.visible = false;
            this.buttonNO.visible = true;
            this.yes.setStyle( this.offStyle );
            this.no.setStyle( this.onStyle );
            this.data.result = 0;
        }
    }

    showButtons()
    {

        this.buttonYES.visible = true;
        this.yes.visible = true;
        this.no.visible = true;

    }

    hideButtons()
    {

        this.buttonYES.visible = false;
        this.buttonNO.visible = false;
        this.yes.visible = false;
        this.no.visible = false;

    }
}


export default Message;