class Ovolador extends PhysicObject{
    constructor(){
        super();
        this.size = null;
        this.model = null;
        this.color = null;
        this.material = null;

        //this.model = this.createModel();
        this.add(this.createModel());
    }
    createModel(){
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
        //this.model.position.y = this.size;
        this.updatePhysicPosition();
        return this.model;
    };
}



class OvoMa extends Ovolador{
    constructor(){
        super();
    }

    createModel(){
        this.size = 2;

        this.shape = new CANNON.Cylinder(2,2,this.size,16);
        this.body = new CANNON.Body({mass:10});
        this.body.addShape(this.shape);


        this.material = new THREE.MeshPhongMaterial({color: 0xff0000 , specular: 0x000000});
        this.model = new THREE.Mesh(
            new THREE.CylinderGeometry(2,2,this.size,16,1,false),
            this.material,
        );
        //this.model.position.y = this.size/2;
        this.model.rotation.x = 1.57;
        this.updatePhysicPosition();
        return this.model;
    };
}