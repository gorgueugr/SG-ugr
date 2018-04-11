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

    add(object){
        if(object.isPhysicObject || object.isPhysicMesh){
            this.addPhysicalObject(object);
        }else{
            super.add(object);
            console.log("Hijos " + object.children.length);
            for(var i=0;i<object.children.length;i++){
                if(object.children[i].isPhysicObject ||object.children[i].isPhysicMesh ){
                    this.addPhysicalObject(object.children);
                }
            }
        }
    }


    addPhysicalObject(object){
        if(object.body != null){
            super.add(object);

            object.updatePhysicPosition();

            this.world.addBody(object.body);
            this.physicsObjects.push(object);


            console.log("Añadiendo objeto fisico: " + object.name);
        }
    }

    updatePhysics(){
        this.world.step(1/60);

        for(var i=0;i<this.physicsObjects.length;i++){
            this.physicsObjects[i].position.copy(this.physicsObjects[i].body.position);
            this.physicsObjects[i].quaternion.copy(this.physicsObjects[i].body.quaternion);
        }
    }

    getObjectFromBody(body){
        for(var i=0;i<this.physicsObjects.length;i++){
            if(this.physicsObjects[i].body == body)
                return this.physicsObjects[i];
        }
        return null;
    }
}

class PhysicObject extends THREE.Object3D{
    constructor(){
        super();
        this.body = null;
        this.shape = null;
        this.isPhysicObject = true;
        this.updatePhysicPosition();
    }

    updatePhysicPosition(){
        if(this.body != null) {
            this.body.position.set(this.position.x, this.position.y, this.position.z);
            this.body.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
        }
    }
}
class PhysicMesh extends THREE.Mesh{
    constructor(geometry,material,shape,mass){
        super(geometry,material);
        this.shape = (shape != null) ?  shape : null;
        this.body = null;
        this.isPhysicMesh = true;
        if(this.shape != null){
            this.body = new CANNON.Body({mass:mass});
            this.body.addShape(this.shape);
        }
        //this.updatePhysicPosition();
    }
    updatePhysicPosition(){
        if(this.body != null) {
            this.body.position.set(this.position.x, this.position.y, this.position.z);
            this.body.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
        }
    }
}