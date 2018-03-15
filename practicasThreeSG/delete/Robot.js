class Robot extends THREE.Object3D {

    constructor(parameters){
        super();

        this.arm = null;
        this.head = null;
        this.body = null;
        this.robot = null;
        this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70}) : parameters.material);

        this.arm = this.createArm();
        this.add(this.arm);
    }




    createArm(){

        var geometry = new THREE.BoxGeometry (1,1,1);
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var hombro = new THREE.Mesh (geometry,material);

//        hombro.position.y = 0.5;

        hombro.position.y = 2.5;

        geometry = new THREE.CylinderGeometry( 1, 2, 1,4);
        var pie = new THREE.Mesh (geometry,material);

        pie.position.y = 0.5;

        geometry = new THREE.CylinderGeometry( 1, 1, 2,20);
        var pierna = new THREE.Mesh (geometry,material);

        pierna.position.y = 0.5;

        var arm = new THREE.Mesh();

        arm.add(hombro);
        arm.add(pie);
        arm.add(pierna);
        return arm;
    }

    createHead(){

    }
    createBody(){

    }
    createRobot(){}

}