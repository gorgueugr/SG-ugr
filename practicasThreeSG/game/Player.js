class Player{
    constructor(scene){

        this.model = null;
        this.physic = null;
        this.loadModel(scene);

    }

    loadModel(scene){
        // instantiate a loader
        // model
        var loader = new THREE.FBXLoader();
        var that = this;
        loader.load( 'obj/Drive.fbx', function ( object ) {

            that.test(scene,object);
            console.log("Loading model");



        },
            function ( object ) {

                console.log("Aqi");



            },
            function ( msg ) {

                console.log("Error");
                console.log(msg);



            });
    }

    test(scene,object){

        console.log(object);
        var temp =  new THREE.CylinderGeometry( 5, 5, 20, 32 );
        temp.translate(0,10,0);

        var phy = new Physijs.CapsuleMesh(temp, new THREE.MeshBasicMaterial(),10);
        phy.add(object);
        this.physic = phy;
        object.position.y = -10;
        object.mixer = new THREE.AnimationMixer( object );
        scene.mixers.push( object.mixer );
        console.log("Object");

        console.log(object);
        var action = object.mixer.clipAction( object.animations[ 0 ] );
        action.play();
        //console.log("Action");

        //console.log(action);
        /*object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );*/
        phy.scale.x = 0.125;
        phy.scale.y = 0.125;
        phy.scale.z = 0.125;
        phy.position.y = 200;
        scene.add(phy);
        //scene.add( object );

    }

}