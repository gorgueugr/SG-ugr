class Player{
    constructor(scene){

        this.model = null;
        this.physic = null;
        this.camera = null;
        this.mixer = null;
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 8 * 5000);
        this.camera.position.set (0,500,2000);
        this.controls = new THREE.PointerLockControls( this.camera );


        this.vectorObject = null;

        this.view = [{
            left: 0,
            top: 0,
            width: 1.0,
            height: 1.0,
            camera: this.camera
        }];
        this.scene = scene;
        this.animations = {};

        this.loadModel(scene);

    }

    loadModel(scene){
        // instantiate a loader
        // model
        var loader = new THREE.FBXLoader();
        var that = this;
        var player = null;

        var exit = function  () {
            console.log("Exit");
        };

        var error = function () {
            console.log("Error cargando modelo");
        };

        loader.load('obj/Ybot.fbx' ,
            function ( object ) {
                player = object;
            }//,
            //exit(),
            //error()
        );
        loader.load('obj/Idle.fbx' ,
            function ( object ) {
                that.addAnimation("idle",object);
            }//,
            //exit(),
            //error()
        );
        loader.load('obj/Walking.fbx' ,
            function ( object ) {
                that.addAnimation("walking",object);
            }//,
            //exit(),
            //error()
        );
        loader.load('obj/Drive.fbx' ,
            function ( object ) {
                that.addAnimation("drive",object);
                that.addPlayer(scene,player);
            }//,
            //exit(),
            //error()
        );
    }

    addPlayer(scene,object){
        var modelBbox = new THREE.Box3();
        modelBbox.setFromObject( object );

        console.log("Box player:");
        console.log(modelBbox);

        var sizeY = modelBbox.max.y - modelBbox.min.y;
        var sizeX =  modelBbox.max.x - modelBbox.min.x;
        var sizeZ = modelBbox.max.z - modelBbox.min.z;

        //object.updateMatrix();
        object.rotation.y = Math.PI;
        object.position.y -= sizeY * 0.5 + 110;

        //var geo =  new THREE.Geometry();
        var geo =  new THREE.CubeGeometry( sizeZ, sizeY , sizeZ );

        //geo.translate(0,sizeY*0.5,0);

        var material = new Physijs.createMaterial(
            new THREE.MeshBasicMaterial({opacity:0,transparent: true }),
            0.9,
            0.1
        );

        var phy = new Physijs.CapsuleMesh(
            geo,
            material,
            10
        );

        phy.receiveShadow = true;
        phy.castShadow = true;


        phy.add(object);
        this.physic = phy;

        this.mixer = new THREE.AnimationMixer( object );
        scene.mixers.push( this.mixer );

        var stick = new THREE.Mesh(
            new THREE.CylinderGeometry(3,3,50,16),
            new THREE.MeshBasicMaterial({color:0xffffff})
        );

        stick.position.y = -25;
        //stick.rotation.z = Math.PI * 0.5;

        var hand = phy.getObjectByName("mixamorigLeftForeArm");
        hand.add(stick);

        phy.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );

        phy.castShadow = true;
        phy.receiveShadow = true;


        var vector = new THREE.Object3D();
        phy.add(vector);
        vector.position.z = 10;
        this.vectorObject = vector;

        phy.scale.x = 0.125;
        phy.scale.y = 0.125;
        phy.scale.z = 0.125;
        phy.position.y = 300;
        phy.position.z = 100;

        console.log("Player:");
        console.log(object);

        phy.add(this.camera);
        this.camera.lookAt(phy.position);
        scene.add(phy);
        phy.addEventListener("ready", function(){
            phy.setAngularFactor(new THREE.Vector3(0, 0, 0));
        });


        scene.add(this.controls.getObject());
        this.animate("idle");


        //scene.add( object );

    }

    addAnimation(name,object){
        if(object == null){
            console.log("animacion null");
            return;
        }
        this.animations[name] = object.animations[0];
    }

    animate(name){
        //this.stopAnimation();
        if(this.animations[name] == null)
            return;

        var action = this.mixer.clipAction( this.animations[name] );
        action.setLoop(THREE.LoopOnce, 0);
        action.play();
        return action;
    }

    stopAnimation(){
        this.mixer.stopAllAction();
    }

    forward(){
        if(this.physic == null)
            return;

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( this.vectorObject.matrixWorld );

        var playerPos = this.physic.position.clone();
        var distance = new THREE.Vector3();

        distance.subVectors( playerPos ,vector );
        distance.normalize();
        distance.multiplyScalar(100);

        distance.y = this.physic.getLinearVelocity().y;
        this.physic.setLinearVelocity(distance);
        this.animate("walking");

    }

    backward(){
        if(this.physic == null)
            return;

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( this.vectorObject.matrixWorld );

        var playerPos = this.physic.position.clone();
        var distance = new THREE.Vector3();

        distance.subVectors( playerPos ,vector );
        distance.normalize();
        distance.multiplyScalar(-100);

        distance.y = this.physic.getLinearVelocity().y;
        this.physic.setLinearVelocity(distance);
        this.animate("walking");
    }

    right(){
        this.rotate(-1);
    }

    left(){
        //this.physic.rotation.y += Math.PI * 0.25;
        this.rotate(1);
    }

    jump(){
        if(this.physic == null)
            return;

        console.log("Jumping");
        this.physic.applyCentralImpulse({x:0,y:1000,z:0});
    }

    rotate(angle){
        if(this.physic == null)
            return;

        this.physic.setAngularVelocity({x:0,y:angle,z:0});
        this.animate("walking");
    }

    stopPlayer(){
        if(this.physic == null)
            return;
        this.physic.setAngularVelocity({x:0,y:0,z:0});
        this.physic.setLinearVelocity({x:0,y:0,z:0});
        this.stopAnimation();
        this.animate("idle");
        console.log("animation stopped");

    }

}