class Ball{
    constructor(scene){
        this.model = null;

        this.vector = null;
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 8 * 5000);
        this.camera.position.set (0,25,100);
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
        var that = this;
        this.model.addEventListener("ready",function () {
            that.model.setAngularFactor({x:0,y:0,z:0});
        });
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
            1
        );

        model.setCcdMotionThreshold(1);

        model.setCcdSweptSphereRadius(0.2);

        var obj = new THREE.Object3D();
        model.add(obj);
        obj.position.z = -1;
        model.add(this.camera);

        this.vector = obj;

        this.arrowHelper = new THREE.Object3D();
        this.arrowHelper.visible = false;
        model.add(this.arrowHelper);

        model.position.y = 350;

        this.model = model;
    }

    forward(){

        this.vector.position.y += this.vector.position.y <= 10 ? 0.5: 0 ;

    }
    backward(){

        this.vector.position.y += this.vector.position.y >= 1 ? -0.5: 0 ;


    }

    right(){

        this.model.rotation.y += Math.PI * 0.125;
        this.model.__dirtyRotation = true;

    }
    left(){

        this.model.rotation.y += - Math.PI * 0.125;
        this.model.__dirtyRotation = true;
    }

    settingMode(){


        var obj = this.model.position.clone();
        obj.z -= 10;
        var origin = this.model.position.clone();
        this.camera.lookAt(origin);
        var length = 10;
        var hex = 0xff0000;

        var direction = new THREE.Vector3().subVectors(obj, origin);

       this.arrowHelper = new THREE.ArrowHelper(direction,origin, length, hex );
       this.model.add(this.arrowHelper);
    }

    tirar(){
        //var dir = this.vector.position.clone();
        //var dif = new THREE.Vector3();
        //dif.subVectors(dir,this.model.position.clone());
        //dif.multiplyScalar(10);

        this.model.applyCentralImpulse({x:0,y:10,z:-100});
        this.model.remove(this.arrowHelper);
        //this.arrowHelper.dispose();
        applicationMode = TheScene.NO_ACTION;
    }

}