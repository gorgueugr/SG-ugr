class Robot extends THREE.Object3D {

    constructor(){
        super();
        this.arm = null;
        this.head = null;
        this.body = null;
        this.robot = null;
        this.height
        this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70}) : parameters.material);



    }




    createArm(){

        var geometry = new THREE.BoxGeometry (1,1,1);
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        this.arm.add(new THREE.Mesh (
                geometry,material));
        geometry = new THREE.CylinderGeometry()
    }

    createHead(){

    }
    createBody(){

    }
    createRobot(){}

}