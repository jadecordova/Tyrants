import 'phaser';
import Unit from './Unit';

export default class Player extends Unit
{
    constructor( config )
    {
        super( config );

        this.weapon = null;
        this.armor = null;
        this.magic = null;
        this.gold = 0;
        this.experience = 0;
        this.items = [];
        this.currentItem = null;
    }

}
