class Ball{
    constructor(scene){
        this.model = null;
        this.cero = new THREE.Vector3(0,0,0);
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 8 * 5000);
        this.camera.position.set (0,0,100);

        this.vectorObject = null;

        this.arrowHelper = null;
        this.scene = scene;
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
            1, //friction
            0.3 //restitution
        );

        var model = new Physijs.SphereMesh(
            geo,
            material,
            10
        );

        model.setDamping(0.2,0.1);

        model.setCcdMotionThreshold(1);

        model.setCcdSweptSphereRadius(0.5);


        var vector = new THREE.Object3D();
        model.add(vector);
        this.vectorObject = vector;



        var length = 25;
        var hex = 0xff0000;
        var direction = new THREE.Vector3(0,0,1);
        this.arrowHelper = new THREE.ArrowHelper(direction.normalize(),model.position, length, hex );
        this.arrowHelper.visible = false;


        model.add(this.arrowHelper);
        model.add(this.camera);

        this.camera.lookAt(this.cero);
        model.position.y = 50;

        this.model = model;
    }

    forward(){



    }
    backward(){

    }

    right(){
        this.rotate(-1);
    }

    left(){
        //this.physic.rotation.y += Math.PI * 0.25;
        this.rotate(1);
    }

    rotate(angle){
        if(this.model == null)
            return;

        this.model.setAngularVelocity({x:0,y:angle,z:0});
        //this.model.setAngularVelocity({x:0,y:0,z:0});

        //this.animate("walking");
    }

    settingMode(){

        var meta = this.scene.meta.cilindro.position.clone();
        var bola = this.model.position.clone();
        var dif = new THREE.Vector3().subVectors(meta,bola).normalize();

        var camPos = dif.clone();
        camPos.multiplyScalar(100);

        var vecPos = camPos.clone();

        //TODO: Poner un objeto vacio en la direccion de la meta este objeto se usa para calcular la direccion de la flecha
        // Con los controles se le podra dar o quitar altura con un minimo y un maximo
        // this.vectorObject , vecPos... Mirar tirar() para ver como se hace.

        camPos.negate();
        camPos.y = 25;

        this.camera.position.copy(camPos);

        this.camera.lookAt(this.cero);
       this.arrowHelper.setDirection(dif);

       this.arrowHelper.visible = true;
    }

    tirar(){

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( this.camera.matrixWorld );

        var ballPos = this.model.position.clone();
        var dir = new THREE.Vector3();

        dir.subVectors(  ballPos , vector  );
        dir.normalize();
        dir.multiplyScalar(500);
        dir.y = 500;

        this.model.applyCentralImpulse(dir);
        this.arrowHelper.visible = false;
        applicationMode = TheScene.NO_ACTION;
    }

    stop(){
        this.model.setAngularVelocity({x:0,y:0,z:0});
    }

}