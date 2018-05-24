class Ball {
    constructor(scene){

        this.model = null;

        this.vector = null;
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 8 * 5000);
        this.camera.position.set (0,10,100);
        this.arrowHelper = null;
        //this.model.position.x = 50;
        this.view = [{
            left: 0,
            top: 0,
            width: 1.0,
            height: 1.0,
            camera: this.camera
        }];
        this.createModel();
        scene.add(this.model);

    };
    createModel(){
        var geo = new THREE.SphereGeometry(1);
        var material = new Physijs.createMaterial(
            new THREE.MeshBasicMaterial({color:0xffffff}),
            0.9, //friction
            0.3 //restitution
        );

        var model = new Physijs.BoxMesh(
            geo,
            material,
            1000
        );


        model.setCcdMotionThreshold(1);

        model.setCcdSweptSphereRadius(0.2);

        var obj = new THREE.Object3D();
        model.add(obj);
        obj.position.z = -1;
        model.add(this.camera);

        this.vector = obj;

        //TODO:ARROW para lanzar la bola.

        var dir = this.vector.position.clone();

        dir.normalize();

        var origin = model.position.clone();
        var length = 100;
        var hex = 0xff0000;

        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        model.add(arrowHelper);
        model.position.y = 150;
        model.position.x = 50;
        this.model = model;

    }

    forward(){

    }
    backward(){

    }

    right(){

    }
    left(){

    }

    tirar(){
        this.model.applyCentralImpulse({x:0,y:1000,z:-10000});

    }

}