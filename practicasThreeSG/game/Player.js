class Player{
    constructor(scene){

        this.model = null;
        this.loadModel(scene);

    }

    loadModel(scene){
        // instantiate a loader
        // model
        var loader = new THREE.FBXLoader();
        loader.load( 'obj/Drive.fbx', function ( object ) {

            object.mixer = new THREE.AnimationMixer( object );
            scene.mixers.push( object.mixer );
            console.log(object);
            var action = object.mixer.clipAction( object.animations[ 0 ] );
            action.play();
            console.log(action);
            /*object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );*/
            scene.add( object );

        } );
    }

    test(){

        this.model.scale.x = 50;
        this.model.scale.y = 50;
        this.model.scale.z = 50;

        console.log(this.model);
// Create an AnimationMixer, and get the list of AnimationClip instances
        var mixer = new THREE.AnimationMixer( this.model );
        console.log(mixer);
        var clips = this.model.animations;
        console.log("Clips:");
        console.log(clips);

    }

}