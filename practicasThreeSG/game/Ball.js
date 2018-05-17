class Ball{
    constructor(scene){
        this.model = null;
        this.createModel();

        this.vector = null;
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 8 * 5000);
        this.camera.position.set (0,10,100);
        this.model.position.y = 350;
        this.arrowHelper = null;
        //this.model.position.x = 50;
        this.view = [{
            left: 0,
            top: 0,
            width: 1.0,
            height: 1.0,
            camera: this.camera
        }];
        scene.add(this.model);
    };
    createModel(){
        var geo = new THREE.SphereGeometry(1);
        var material = new Physijs.createMaterial(
            new THREE.MeshBasicMaterial({color:0xffffff}),
            0.9,
            0.3
        );

        var model = new Physijs.SphereMesh(
            geo,
            material,
            100
        );

        model.setCcdMotionThreshold(1);

        model.setCcdSweptSphereRadius(1);

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

        this.arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        model.add(arrowHelper);

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

}