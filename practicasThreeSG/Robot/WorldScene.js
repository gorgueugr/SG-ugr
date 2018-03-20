class WorldScene{
    constructor(){
        this.world = new CANNON.World();
        this.bodies = [];

        this.world.gravity.set(0,0,0);
        this.world.boardphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
    }

    addBody(object,type,mass){
        var shape = new CANNON.Sphere(1);
        var body = new CANNON.Body({mass:1});



        body.addShape(shape);
        this.bodies.push(body);
        this.world.add(body);

        if(object != undefined){
            body.position.set(object.position.x,object.position.y,object.position.z);
            body.quaternion.set(object.quaternion.x,object.quaternion.y,object.quaternion.z,object.quaternion.w);
        }
        console.log(body.position);
        console.log(object.position);

    }
}