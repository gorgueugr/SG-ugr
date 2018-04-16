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

class OvoGra extends THREE.Object3D{
    constructor(){
        super();
        this.material = null;
        this.model = null;
        this.size = 1;
        this.radio = 10;

        this.tween = null;
        this.tweenB = null;


        this.add(this.createModel());
    }
    createModel(){

        //this.size = 1;

        //var loader = new THREE.TextureLoader();
        //var texture =  loader.load ( 'imgs/good.jpg' );

        this.material = new THREE.MeshBasicMaterial({color:0x00ff00});


        this.model = new THREE.Mesh(
            new THREE.SphereGeometry( this.size, 16, 16 ),
            this.material
        );

        this.add(this.model);

        /*
        this.model.position.y = 0;
        this.model.rotation.y = 0;
        */
        this.model.applyMatrix(new THREE.Matrix4().makeTranslation(this.radio,0,0));
        //this.model.position.x = this.radio;

        return this.model;
    }

    animate(){
        var orig = {y:0 , r:0 };
        var pos = { y:0 , r:0 };
        var dest = { y:16 , r:25.12 };

        this.tween = new TWEEN.Tween(pos).to(dest, 4000);
        this.tweenB =  new TWEEN.Tween(pos).to(orig, 4000);
        var that = this;
        this.tween.onUpdate(function(){
            //that.model.applyMatrix(new THREE.Matrix4().makeTranslation(this.radio,0,0));
            //that.model.position.x = that.radio;
            that.position.y = pos.y;
            that.rotation.y = pos.r;
        });
        this.tweenB.onUpdate(function () {
            //that.model.applyMatrix(new THREE.Matrix4().makeTranslation(this.radio,0,0));
            //that.model.position.x = that.radio;
            that.position.y = pos.y;
            that.rotation.y = pos.r;
        });
        this.tween.chain(this.tweenB);
        this.tweenB.chain(this.tween);
        this.tween.start();
    }
    stopAnimation(){
        this.gra.tween.stop();
        this.gra.tweenB.stop();
    }

}