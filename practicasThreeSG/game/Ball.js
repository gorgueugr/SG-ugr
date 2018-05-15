class Ball{
    constructor(scene){
        this.model = null;
        this.createModel();


        this.model.position.y = 350;
        //this.model.position.x = 50;

        scene.add(this.model);
    };
    createModel(){
        var geo = new THREE.SphereGeometry(1);
        var material = new THREE.MeshBasicMaterial({color:0xffffff});

        var model = new Physijs.SphereMesh(
            geo,
            material,
            100
        );

        model.setCcdMotionThreshold(1);

        model.setCcdSweptSphereRadius(0.2);

        this.model = model;
    }


}