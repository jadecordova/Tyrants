import 'phaser';
import Unit from './Unit';

export default class Player extends Unit
{
    constructor( scene, x, y, texture, frame, type, hp, damage )
    {
        super( scene, x, y, texture, frame, type, hp, damage );

        this.weapon = null;
        this.armor = null;
        this.magic = null;

    }

}
