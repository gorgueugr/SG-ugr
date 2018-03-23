class WorldScene extends THREE.Scene{
    constructor(){
        super();
        //World
        this.world = new CANNON.World();
        this.bodies = [];

        this.world.gravity.set(0,0,0);
        this.world.boardphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        this.physicsObjects = []; //objetos fisicos
        //World
    }

    addPhysicalObject(object){
        if(object.body != null){
            this.add(object);
            this.world.addBody(object.body);
            this.physicsObjects.push(object);

            object.body.position.set(object.position.x,object.position.y,object.position.z);
            object.body.quaternion.set(object.quaternion.x,object.quaternion.y,object.quaternion.z,object.quaternion.w);
            console.log(object.position);
        }
    }

    updatePhysics(){
        this.world.step(1/60);

        for(var i=0;i<this.physicsObjects.length;i++){
            this.physicsObjects[i].position.copy(this.physicsObjects[i].body.position);
        }
    }
}

class PhysicObject extends THREE.Object3D{
    constructor(){
        super();
        this.body = null;
        this.shape = null;
        this.isPhysicObject = true;
    }
}
class PhysicMesh extends THREE.Mesh{
    constructor(geometry,material,shape,mass){
        super(geometry,material);
        this.shape = shape || null;
        this.body = null;
        this.isPhysicMesh = true;
        if(this.shape != null){
            this.body = new CANNON.Body({mass:mass});
            this.body.addShape(this.shape);
        }
    }
}