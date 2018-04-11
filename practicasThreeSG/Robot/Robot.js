//made by gorgue

class Robot extends PhysicObject {
    constructor(parameters){
        super();

        this.height = null;
        this.arms = null;

        this.shoulders = [];
        this.legs = [];

        this.bodyRobot = null;
        this.head = null;

        var loader = new THREE.TextureLoader();

        this.material = new THREE.MeshPhongMaterial ({color: 0xffffff , specular: 0xffffff, shininess: 15});
        this.blackMaterial = new THREE.MeshPhongMaterial ({color: 0x000000 , specular: 0xffffff, shininess: 15});
        this.blueMaterial =  new THREE.MeshPhongMaterial ({color: 0x0A0AFF, specular: 0xffffff, shininess: 15});

        this.bodyTexture =  loader.load ( 'imgs/body.JPG' );
        this.bodyMaterial = new THREE.MeshPhongMaterial( { map:  this.bodyTexture, specular: 0xffffff, shininess: 15} );
        this.bodyTexture.wrapS = this.bodyTexture.wrapT = THREE.RepeatWrapping;

        this.headTexture = loader.load ( 'imgs/head.JPG' );
        this.headMaterial = new THREE.MeshPhongMaterial( { map:  this.headTexture, specular: 0xffffff ,shininess: 15} );
        this.headTexture.wrapS = this.headTexture.wrapT = THREE.RepeatWrapping;

        this.body = new CANNON.Body({mass:10});

        this.castShadow = true;
        this.receiveShadow = true;

        this.model = this.createModel();
        this.add(this.model);

        var bbox = new THREE.Box3().setFromObject(this.model);
        var a = bbox.getSize();
        //var abox = new THREE.Vector3(bbox.min);
        //console.log(a);

        //this.shape = new CANNON.Sphere(5);
        this.shape = new CANNON.Box(new CANNON.Vec3(a.x/2,a.y/2,a.z/2));


        //this.body.addShape(new CANNON.Sphere(2),new CANNON.Vec3(0,2.5,0),this.head.geometry.quaternion);
        //this.body.addShape(new CANNON.Cylinder(2,2,4,16),new CANNON.Vec3(0,2.5,0),this.bodyRobot.geometry.quaternion);
        this.body.addShape(this.shape,this.position,this.quaternion);
        //this.shape = new CANNON.Box(new CANNON.Vec3(3,3,3));

        this.updatePhysicPosition();
       // this.body.addShape(this.shape);

    }

    createArm(){
        var foot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5,1,1,4,1,false),
            this.blueMaterial
            );

        foot.position.y = 0.5;
        foot.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(0.79));

        var leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25,0.25,1,8,1,true),
            this.bodyMaterial
        );

        leg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0.5, 0));
        leg.scale.y = 5;
        this.legs.push(leg);

        var shoulder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35,0.35,1.25,8,1,false),
            this.blueMaterial
        );

        shoulder.position.y = 5;
        shoulder.rotation.z = 1.57;

        this.shoulders.push(shoulder);

        foot.add(shoulder);
        foot.add(leg);
        return foot;
    }

    createArms(height){
        this.arms = new THREE.Mesh();
        var left = this.createArm(height);
        var right = this.createArm(height);

        left.position.x = -2.5;
        right.position.x = 2.5;

        this.arms.add(left);
        this.arms.add(right);
        return this.arms;
    }

    createHead(){

        this.head = new PhysicMesh(
            new THREE.SphereGeometry(2,16,14,0,6.3,0,1.6),
            this.headMaterial,
            new CANNON.Sphere(2),
            10
        );

        //            new THREE.CylinderGeometry(0.5,0.5,1,16,1,false),

        var eye = new PhysicMesh(
            new THREE.SphereGeometry(0.35,16,14,0,6.3,0,1.6),
            this.blackMaterial,
            new CANNON.Sphere(0.35),
            10
        );

        eye.rotation.x = 1.57;
        eye.position.y = 1;
        eye.position.z = 1.6;

        this.head.add(eye);
        //this.body.addShape(this.head.body.shapes[0],this.head.position,this.head.quaternion);
        return this.head;
    }

    createBody(){
        this.bodyRobot = new THREE.Mesh(
            new THREE.CylinderGeometry(2,2,4,16,1,false),
            this.bodyMaterial
        );

        this.bodyRobot.material.map.offset.set(0.15,0);
        this.bodyRobot.material.map.repeat.set(1,1);
        this.bodyRobot.geometry.translate(0,-2,0);
        this.bodyRobot.add(this.createHead());

        this.bodyRobot.position.y = 1;
        return this.bodyRobot;
    }

    createModel(){
        this.model = new THREE.Mesh();
        this.createBody();
        //this.bodyRobot.position.y = 6;
        this.model.add(this.bodyRobot);
        this.model.add(this.createArms());
        //this.body = this.head.body;
        this.model.position.y = -4.5;

        return this.model;
    }

    setHeight(height){
        if(height>=0 && height<=2){
            this.bodyRobot.position.y = height + 5;
            //for(var i =0;i<this.shoulders.length;i++)
            this.shoulders[0].position.y = height + 4;
            this.shoulders[1].position.y = height + 4;
            //for(var i =0;i<this.legs.length;i++)
            this.legs[0].scale.y = height + 4 ;
            this.legs[1].scale.y = height + 4 ;
        }

    }

    setHeadRotation(angle){
        if(angle>=-1.4 && angle<=1.4)
            this.head.rotation.y = angle;
    }

    setBodyRotation(angle){
        if(angle>=-0.75 && angle<=0.5)
            this.bodyRobot.rotation.x = angle;
    }


}