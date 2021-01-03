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
Creates player for current scene.
@scene: the current scene.
------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function InitPlayer( scene )
{
    scene.player = scene.physics.add.sprite( 200, 200, 'player', 6 );
    scene.player.setCollideWorldBounds( true );

    // Player hit area.
    scene.player.body.setSize( 36, 24 );
    scene.player.body.setOffset( 14, 36 );

}


export {CreateZones, CreateObjects, InitPlayer};
