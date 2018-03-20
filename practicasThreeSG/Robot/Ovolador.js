class Ovolador extends THREE.Object3D{
    constructor(){
        super();

        this.model = null;
        this.color = null;
        this.material = null;

        //this.model = this.createModel();
        this.add(this.createModel());
    }
    createModel(){
    }
    getModel(){
        return this.model;
    }
}


class OvoBu extends Ovolador {
    constructor(){
        super();
    }

    createModel(){
        var diam = 2;
        this.material = new THREE.MeshPhongMaterial({color: 0x33cc33 , specular: 0x000000});
        this.model = new THREE.Mesh(
            new THREE.SphereGeometry( diam, 16, 16 ),
            this.material
        );
        this.model.position.y = diam;

        return this.model;
    };
}



class OvoMa extends Ovolador{
    constructor(){
        super();
    }

    createModel(){
        var height = 2;
        this.material = new THREE.MeshPhongMaterial({color: 0xff0000 , specular: 0x000000});
        this.model = new THREE.Mesh(
            new THREE.CylinderGeometry(2,2,height,16,1,false),
            this.material
        );
        this.model.position.y = height/2;
        this.model.rotation.x = 1.57;
        return this.model;
    };
}