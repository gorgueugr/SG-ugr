class Ovolador extends PhysicObject{
    constructor(){
        super();
        this.size = null;
        this.model = null;
        this.color = null;
        this.material = null;

        this.vx = 0;
        this.vy = 0;
        this.vz = 0;

        this.initPosition = new THREE.Vector3();

        this.add(this.createModel());
        this.applyVelocity();

        this.model.castShadow = true;
        //this.model.receiveShadow = true;
        this.body.type = CANNON.Body.KINEMATIC;
        this.body.collisionResponse = false;



    }
    createModel(){}
    applyVelocity(){}
    resetPosition(){}
    reset(){
        this.resetPosition();
        //this.position.copy(this.initPosition);
        this.applyVelocity();
        this.updatePhysicPosition();
    }
}


class OvoBu extends Ovolador {
    constructor(){
        super();
    }

    createModel(){
        this.size = 2;
        this.shape = new CANNON.Sphere(this.size);
        this.body = new CANNON.Body({mass:10});
        this.body.addShape(this.shape);

        this.material = new THREE.MeshPhongMaterial({color: 0x0000aa , specular: 0x404040});
        this.model = new THREE.Mesh(
            new THREE.SphereGeometry( this.size, 16, 16 ),
            this.material
        );

        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);

        return this.model;
    };
    applyVelocity(){
        this.vx =  Math.random() * 50 + 1;
        this.vy = 0;
        this.vz = 0;// Math.random() * 25 - 12;
        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);
    }
    resetPosition(){
        //var xyz = new THREE.Vector3(75,3,0);
        this.position.copy(this.initPosition);
    }
}



class OvoMa extends Ovolador{
    constructor(){
        super();
    }

    createModel(){
        this.size = 5;
        var width = 0.3;

        //this.body.quaternion.setFromEuler(0,0,0);

        this.material = new THREE.MeshPhongMaterial({color: 0xff0000 , specular: 0x000000});
        this.model = new PhysicMesh(
            new THREE.CylinderGeometry(width,width,this.size,16,1,false),
            this.material,
            new CANNON.Cylinder(width,width,this.size,16),
            1
        );


        //Mover o rotar el model para ajustar con la fisica,
        //Para posicionar le objeto tocar this.

        this.position.y = 1;
        this.rotation.y = 1.57;
        //this.model.position.y = 1;
        this.model.rotation.x = 1.57;
        this.body = this.model.body;

        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);

        return this.model;
    };

    applyVelocity(){
        this.vx=  Math.random() * -50 - 1;
        this.vy = 0;
        this.vz =  0 ;//Math.random() * 25 - 12;
        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);
    }
    resetPosition(){
        //var xyz = new THREE.Vector3(-75,3,0);
        this.position.copy(this.initPosition);
    }
}