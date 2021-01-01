import 'phaser';
import './Unit';

class PlayerCharacter extends Unit
{

    constructor( scene, x, y, texture, frame, type, hp, damage )
    {
        super( scene, x, y, texture, frame, type, hp, damage );
    }
}
