import 'phaser';
import './Menu';

class ActionsMenu extends Menu
{

    constructor( x, y, scene )
    {
        super( x, y, scene );
        this.addMenuItem( 'Attack' );
    }

    confirm()
    {
        this.scene.events.emit( 'SelectedAction' );
    }

}
