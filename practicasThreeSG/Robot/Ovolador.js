//Made by:
/**
 * @author Jorge Soler
 *
 */
// Base Class of the flying objects
class Ovolador extends PhysicObject{
    constructor(){
        super();
        this.size = null;
        this.model = null;
        this.color = null;
        this.material = null;

        //Difficulty of the game
        this.difficulty = 1;

        //Velocity
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;


        this.initPosition = new THREE.Vector3();

        this.add(this.createModel());
        this.applyVelocity();

        this.model.castShadow = true;
        this.model.receiveShadow = true;

        //Physic
        this.body.type = CANNON.Body.KINEMATIC; //This type is not affected by gravity
        this.body.collisionResponse = false;  //Do not respond to collisions with other bodies



    }
    createModel(){}
    applyVelocity(){}
    resetPosition(){}
    reset(){
        this.resetPosition();
        this.applyVelocity();
        this.updatePhysicPosition();
    }
}

//Good Flying objects
class OvoBu extends Ovolador {
    constructor(){
        super();

    }

    createModel(){
        //Construir objeto fisico forma 1
        this.size = 2;
        //Physic
        this.shape = new CANNON.Sphere(this.size);
        this.body = new CANNON.Body({mass:10});
        this.body.addShape(this.shape);
        //
        var loader = new THREE.TextureLoader();
        var texture =  loader.load ( 'imgs/good.jpg' );

        this.material = new THREE.MeshLambertMaterial({map: texture,
            emissive: 0x0000aa,
            transparent:true,
            opacity:0.5
        });

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
        if(this.difficulty == 3)
            this.vz = Math.random() * 12 - 6;
        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);
    }
    resetPosition(){
        this.position.copy(this.initPosition);
    }
}


//Bad flying objects
class OvoMa extends Ovolador{
    constructor(){
        super();
    }

    createModel(){
        //Construir objeto fisico forma 2
        this.size = 5;
        var width = 0.3;

        //No hace falta una textura (jpg) aunque se podria haber añadido.
        this.material =new THREE.MeshLambertMaterial({color: 0xaa0000 ,
            specular: 0xffffff,
            emissive: 0xff0000,
            transparent:true,
            opacity:0.5
        });


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
        this.model.rotation.x = 1.57;
        this.body = this.model.body;

        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);

        return this.model;
    };

    applyVelocity(){
        this.vx=  Math.random() * -100 * this.difficulty - 1;
        this.vy = 0;
        this.vz =  0 ;//Math.random() * 25 - 12;
        if(this.difficulty == 3)
            this.vz = Math.random() * 12 - 6;
        this.body.velocity = new CANNON.Vec3(this.vx,this.vy,this.vz);
    }
    resetPosition(){
        this.position.copy(this.initPosition);
    }
}