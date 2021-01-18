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
        this.action = data.action;
        this.parameter = data.parameter;
        this.result = 'yes';

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
            this.scene.resume( 'WorldScene', {
                result: this.result,
                action: this.action,
                parameter: this.parameter
            } );

            this.scene.sleep( 'Message' );
        } );

        leftKey.on( 'down', event =>
        {
            if ( this.action !== undefined )
            {
                if ( this.result === 'no' )
                {
                    this.setState( 'yes' );
                }
            }
        } );

        rightKey.on( 'down', event =>
        {
            if ( this.action !== undefined )
            {
                if ( this.result === 'yes' )
                {
                    this.setState( 'no' );
                }
            }
        } );

        this.events.on( Phaser.Scenes.Events.WAKE, ( strageThings, eventData ) =>
        {
            this.message.text = eventData.text;
            this.action = eventData.action;
            this.parameter = eventData.parameter;

            console.log( 'parameter on wake: ' + eventData.parameter );
            this.setState( 'yes' );

            if ( this.action == undefined )
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

        this.background = this.add.image( this.originX, this.originY, 'dialog' );
        this.background.alpha = 0.5;

        this.message = this.add.text( this.originX, this.originY, this.txt, this.messageStyle );
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

        if ( this.action == undefined )
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
            this.result = 'yes';
        }
        else
        {
            this.buttonYES.visible = false;
            this.buttonNO.visible = true;
            this.yes.setStyle( this.offStyle );
            this.no.setStyle( this.onStyle );
            this.result = 'no';
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