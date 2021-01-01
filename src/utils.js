import 'phaser';

function CreateWalls( scene, map, layerName )
{
    // Get the Tiled object layer.
    const objectLayer = map.getObjectLayer( layerName );
    const numberOfWalls = objectLayer.objects.length;

    // Create zones for each rectangle in the layer in a physics group.
    scene.walls = scene.physics.add.group( {
        classType: Phaser.GameObjects.Zone
    } );

    for ( let i = 0; i < numberOfWalls; i++ )
    {
        let currentZone = scene.walls.create( objectLayer.objects[i].x, objectLayer.objects[i].y, objectLayer.objects[i].width, objectLayer.objects[i].height );
        currentZone.setOrigin( 0, 0 );
        currentZone.body.immovable = true;
    }
    scene.physics.add.collider( scene.player, scene.walls, false, false, this );
}

function CreateObjects( scene, map, imageKey, layerName )
{
    // Get the Tiled object layer.
    const objectLayer = map.getObjectLayer( layerName );

    // Get the number of objects.
    const numberOfObjects = objectLayer.objects.length;

    // Create sprites.
    for ( let i = 0; i < numberOfObjects; i++ )
    {
        // Get properties from JSON file and assign them to temporal object.
        let properties = {};
        AssignProperties( properties, objectLayer.objects[i].properties );

        // Create sprites
        let currentObject = scene.physics.add.sprite( objectLayer.objects[i].x, objectLayer.objects[i].y, imageKey, properties.image );
        currentObject.setOrigin( 0, 1 );
        currentObject.body.immovable = true;

        // Assign properties from temporal object.
        Object.assign( currentObject, properties );

        scene.physics.add.collider( scene.player, currentObject, false, false, this );

    }
}

function AssignProperties( obj, prop )
{
    if ( prop )
        prop.forEach( element => obj[element.name] = element.value );
}

export {CreateWalls, CreateObjects};
