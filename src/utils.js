import 'phaser';

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Creates rectangular zones to act as collision objects for the map walls.
@scene: the scene the map belongs to.
@map: the map objecto to extract the rectangles from.
@layerName: the name of the layer containing the rectangles.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CreateZones( scene, map, layerName )
{
    // Get the Tiled object layer.
    const objectLayer = map.getObjectLayer( layerName );
    const numberOfZones = objectLayer.objects.length;

    // Create zones for each rectangle in the layer in a physics group.
    let zones = scene.physics.add.group( {
        classType: Phaser.GameObjects.Zone
    } );

    for ( let i = 0; i < numberOfZones; i++ )
    {
        let currentZone = zones.create( objectLayer.objects[i].x, objectLayer.objects[i].y, objectLayer.objects[i].width, objectLayer.objects[i].height );
        currentZone.setOrigin( 0, 0 );
        currentZone.body.immovable = true;

        if ( objectLayer.objects[i].properties )
        {
            let properties = AssignProperties( objectLayer.objects[i].properties );
            // Assign properties from temporal object.
            Object.assign( currentZone, properties );
        }
    }

    return zones;
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Creates active objects from Tiled object layer.
@scene: the scene the map belongs to.
@map: the map objecto to extract the rectangles from.
@layerName: the name of the layer containing the rectangles.
RETURNS: active objects array.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CreateObjects( scene, map, imageKey, layerName )
{
    let result = [];

    // Get the Tiled object layer.
    const objectLayer = map.getObjectLayer( layerName );

    // Get the number of objects.
    const numberOfObjects = objectLayer.objects.length;

    // Create sprites.
    for ( let i = 0; i < numberOfObjects; i++ )
    {
        // Get properties from JSON file and assign them to temporal object.
        let properties = AssignProperties( objectLayer.objects[i].properties );

        // Create sprites
        let currentObject = scene.physics.add.sprite( objectLayer.objects[i].x, objectLayer.objects[i].y, imageKey, properties.image );
        currentObject.setOrigin( 0, 1 );
        currentObject.body.immovable = true;

        // Assign properties from temporal object.
        Object.assign( currentObject, properties );

        result.push( currentObject );
    }

    return result;
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Assigns Tiled object properties directly to object.
@obj: object to assign properties to.
@map: properties object to be extracted and assigned.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function AssignProperties( prop )
{
    let properties = {};

    if ( prop )
    {
        prop.forEach( element => properties[element.name] = element.value );
    }

    return properties;
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Creates animations.
@scene: the current scene.
@imageKey: image to load frames from.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CreateAnimations( scene, imageKey )
{
    scene.anims.create( {
        key: 'down-stop',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [0]
        } ),
        frameRate: 10,
        repeat: 0
    } );
    scene.anims.create( {
        key: 'down',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [1, 2, 3, 4, 5, 6, 7, 8]
        } ),
        frameRate: 10,
        repeat: -1
    } );
    scene.anims.create( {
        key: 'up-stop',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [9]
        } ),
        frameRate: 10,
        repeat: 0
    } );
    scene.anims.create( {
        key: 'up',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [10, 11, 12, 13, 14, 15, 16, 17]
        } ),
        frameRate: 10,
        repeat: -1
    } );
    scene.anims.create( {
        key: 'right-stop',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [18]
        } ),
        frameRate: 10,
        repeat: 0
    } );
    scene.anims.create( {
        key: 'right',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [19, 20, 21, 22, 23, 24, 25, 26]
        } ),
        frameRate: 10,
        repeat: -1
    } );
    scene.anims.create( {
        key: 'left-stop',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [27]
        } ),
        frameRate: 10,
        repeat: 0
    } );
    scene.anims.create( {
        key: 'left',
        frames: scene.anims.generateFrameNumbers( imageKey, {
            frames: [28, 29, 30, 31, 32, 33, 34, 35]
        } ),
        frameRate: 10,
        repeat: -1
    } );
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Sleep action.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function Sleep()
{
    console.log( 'sleeping' );
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Gold animation and assignment to player.
@data: object containing player, object info and result of dialog.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function Gold( data )
{
    if ( Number( data.object.parameter ) > 0 )
    {
        let coin = data.player.scene.coin;
        let tween = data.player.scene.coinTween;
        let message = data.player.scene.coinText;

        // Show coin.
        coin.setPosition( data.player.x, data.player.y );
        coin.visible = true;
        coin.anims.play( 'coin', true );

        // Show quantity text.
        message.setPosition( data.player.x, data.player.y );
        message.text = '+' + data.object.parameter;
        message.visible = true;

        // Use scene tween if exits, or create it.
        if ( !tween )
        {
            data.player.scene.coinTween = data.player.scene.tweens.add( {
                targets: [data.player.scene.coin, data.player.scene.coinText],
                repeat: 0,
                props: {
                    y: {value: '-=50', duration: 2000, ease: 'Cubic.easeOut'},
                    alpha: {value: 0, duration: 2000, ease: 'Cubic.easeIn'},
                }
            } );

            tween = data.player.scene.coinTween;
        }

        // Set start value of tween.
        // Setting just the coin value to the y position of the player simply doesn't work...
        tween.data['0'].start = data.player.y;
        tween.data['1'].start = data.player.y;
        tween.restart();

        // Give gold to player.
        data.player.gold += Number( data.parameter );
        // Set gold to 0 in object.
        data.object.parameter = 0;

        // Set new message in object.
        data.object.message = 'Nothing.';

        // Remove action.
        data.object.action = undefined;

    }
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Creates coin.
@scene: scene object.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CreateCoin( scene )
{
    let coin = scene.add.sprite( 200, 200, 'atlas-01', 'coin-01.png' );
    scene.anims.create( {
        key: 'coin',
        frames: scene.anims.generateFrameNames( 'atlas-01', {prefix: 'coin-', start: 1, end: 6, zeroPad: 2, suffix: '.png'} ),
        frameRate: 10,
        repeat: 2
    } );
    coin.visible = false;

    return coin;
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Creates text showing gold quantity.
@scence: scene object.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CreateCoinText( scene )
{
    let style = {
        fontFamily: 'textFont',
        fontSize: '18px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        align: 'center',
    }
    let txt = scene.add.text( 0, 0, '', style );
    txt.visible = false;
    return txt;
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------
Takes item.
@data: object containing player, object info and result of dialog.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function TakeItem( data )
{
    if ( data.result )
    {
        data.player.currentItem = data.object.parameter;
        data.player.scene[data.object.parameter].destroy();
    }
}

export
{
    CreateZones,
    CreateObjects,
    CreateAnimations,
    CreateCoin,
    CreateCoinText,
    Sleep,
    Gold,
    TakeItem
};
