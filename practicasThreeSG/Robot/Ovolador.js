class Ovolador extends PhysicObject{
    constructor(){
        super();
        this.size = null;
        this.model = null;
        this.color = null;
        this.material = null;

        this.castShadow = true;
        this.receiveShadow = true;

        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.applyVelocity();

        //this.model = this.createModel();
        this.add(this.createModel());

        this.body.type = CANNON.Body.KINEMATIC;

        this.body.addEventListener("collide",function (e) {
            console.log("golpe");
        });

    }
    createModel(){
    }
    applyVelocity(){
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

        this.material = new THREE.MeshPhongMaterial({color: 0x33cc33 , specular: 0x000000});
        this.model = new THREE.Mesh(
            new THREE.SphereGeometry( this.size, 16, 16 ),
            this.material
        );


        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);

        //this.model.position.y = this.size;
        this.updatePhysicPosition();
        return this.model;
    };
    applyVelocity(){
        this.vx=  Math.random() * 50 + 25;
        this.vy =  Math.random() * 5 + 1;
        this.vz =  Math.random() * 5 + 1;
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

        //this.body.angularVelocity = new CANNON.Vec3(0,0,0);
        //this.model.position.y = this.size/2;
        //this.model.rotation.x = 1.57;
        //this.model.updatePhysicPosition();
        //this.updatePhysicPosition();
        return this.model;
    };

    applyVelocity(){
        this.vx=  Math.random() * -50 - 25;
        this.vy =  Math.random() * 5 - 1;
        this.vz =  Math.random() * 5 - 1;
    }
}