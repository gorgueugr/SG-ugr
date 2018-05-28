class Ball{
    constructor(scene){

        this.model = null;
        this.cero = new THREE.Vector3(0,0,0);

        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 8 * 5000);
        this.camera.position.set (0,0,100);

        this.secondCamera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.set (50,0,0);

        this.direction = this.cero.clone();
        this.vectorObject = null;
        this.powerFactor = 1;
        this.length = null;

        this.playerPos = null;

        this.arrowHelper = null;
        this.scene = scene;
        this.view = [{
            left: 0,
            top: 0,
            width: 1.0,
            height: 1.0,
            camera: this.camera
        },
            {
                left: 0.7,
                top: 0,
                width: 0.3,
                height: 0.3,
                camera: this.secondCamera
            }
        ];
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


        var vector = new THREE.Mesh(
            new THREE.CubeGeometry(1,1,1,1),
            new THREE.MeshBasicMaterial()
        );
        model.add(vector);

        var playerPos = new THREE.Object3D();
        this.playerPos = playerPos;
        model.add(playerPos);


        //vector.position.z = -10;
        vector.visible = false;
        this.vectorObject = vector;




        var length = 15;
        this.length = length;
        var hex = 0xff0000;
        var direction = new THREE.Vector3(0,0,1);
        this.arrowHelper = new THREE.ArrowHelper(direction.normalize(),model.position, length, hex );
        this.arrowHelper.visible = false;


        model.add(this.arrowHelper);
        model.add(this.camera);
        model.add(this.secondCamera);

        model.castShadow = true;
        model.receiveShadow = true;

        this.camera.lookAt(this.cero);
        this.secondCamera.lookAt(this.cero);
        model.position.x = -750;
        model.position.y = 50;
        model.position.z = 550;

        this.model = model;
    }

    forward(){
        this.vectorObject.position.y += 5;

        //var dir = this.direction.clone();
        var dir = this.calculateArrowDirection();
        //dir.y += 0.05;
        //this.inclinationSteps += 1;
        //dir.normalize();
        this.updateArrow(dir);
    }
    backward(){
        this.vectorObject.position.y -= 5;
        //var dir = this.direction.clone();
        var dir = this.calculateArrowDirection();
        //dir.y -= 0.05;
        //this.inclinationSteps -= 1;
        //dir.normalize();
        this.updateArrow(dir);
    }

    right(){
        this.rotate(-1);
    }

    left(){
        //this.physic.rotation.y += Math.PI * 0.25;
        this.rotate(1);
    }

    morePower(){
        this.powerFactor += this.powerFactor == 11 ? 0 : 1;
        this.arrowHelper.scale.x = this.powerFactor;
        this.arrowHelper.scale.y = this.powerFactor;
        this.arrowHelper.scale.z = this.powerFactor;
        //this.arrowHelper.scale(this.length*this.powerFactor);
    }
    lessPower(){
        this.powerFactor -= this.powerFactor == 1 ? 0 : 1;
        this.arrowHelper.scale.x = this.powerFactor;
        this.arrowHelper.scale.y = this.powerFactor;
        this.arrowHelper.scale.z = this.powerFactor;
        //this.arrowHelper.setLength(this.length*this.powerFactor);
    }

    rotate(angle){
        if(this.model == null)
            return;

        //this.model.setAngularVelocity({x:0,y:angle,z:0});
        var pos  = this.vectorObject.position.clone();
        pos.applyAxisAngle(new THREE.Vector3(0,1,0),0.05 * Math.PI *  angle);
        this.vectorObject.position.copy(pos);

        var dir = this.calculateArrowDirection();
        this.updateArrow(dir);

        //this.model.updateMatrix();
        //this.vectorObject.updateMatrixWorld(true);
    }

    settingMode(){

        var meta = this.scene.meta.base.position.clone();
        var bola = this.model.position.clone();

        //var dif = new THREE.Vector3().subVectors(meta,bola).normalize();
        var dif = this.calculateDirection(meta,bola);

        var camPos = dif.clone();
        camPos.multiplyScalar(100);

        var vecPos = camPos.clone();

        //vecPos.y = 25;

        this.vectorObject.position.copy(vecPos);

        camPos.negate();
        camPos.y = 25;

        this.camera.position.copy(camPos);
        this.camera.lookAt(this.cero);

        var rot = camPos.clone();
        rot.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI * 0.5);

        var playerPos = dif.clone();
        playerPos.multiplyScalar(25);
        playerPos.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI * 0.5);
        playerPos.y = 25;
        this.playerPos.position.copy(playerPos);

        this.secondCamera.position.copy(rot);
        this.secondCamera.lookAt(this.cero);


        this.camera.updateMatrix();
        this.vectorObject.updateMatrix();
        this.secondCamera.updateMatrix();

        var dir = this.calculateArrowDirection();
        this.updateArrow(dir);
        this.arrowHelper.visible = true;
    }


    calculateDirection(pos1,pos2){
        return new THREE.Vector3().subVectors(pos1,pos2).normalize();
    }

    updateArrow(dir){
        //console.log("dir:",dir);
        this.direction.copy(dir);
        this.arrowHelper.setDirection(dir);
    }

    calculateArrowDirection(){

        var vector = new THREE.Vector3();
        this.vectorObject.getWorldPosition(vector);
       // vector.setFromMatrixPosition( this.vectorObject.matrixWorld );

        var ballPos = this.model.position.clone();
        //ballPos.setFromMatrixPosition( this.model.matrixWorld );

        //console.log("vector:",vector);
        //console.log("ballpos:",ballPos);
        return this.calculateDirection(vector,ballPos);
    }

    tirar(){


        var dir = this.direction.clone();
       dir.multiplyScalar(500 * this.powerFactor);
        //dir.y = 500;

        this.model.applyCentralImpulse(dir);
        this.arrowHelper.visible = false;
        this.direction = this.cero.clone();
        applicationMode = TheScene.NO_ACTION;
    }

    stop(){
        this.model.setAngularVelocity({x:0,y:0,z:0});
    }

}