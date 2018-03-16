//made by gorgue

class Robot extends THREE.Object3D {
    constructor(parameters){
        super();

        this.height = null;
        this.arms = null;

        this.shoulders = [];
        this.legs = [];

        this.body = null;
        this.head = null;

        var loader = new THREE.TextureLoader();

        this.material = new THREE.MeshPhongMaterial ({color: 0xffffff , specular: 0xffffff, shininess: 15});
        this.blackMaterial = new THREE.MeshPhongMaterial ({color: 0x000000 , specular: 0xffffff, shininess: 15});
        this.blueMaterial =  new THREE.MeshPhongMaterial ({color: 0x0A0AFF, specular: 0xffffff, shininess: 15});

        this.bodyTexture =  loader.load ( 'imgs/body.JPG' );
        this.bodyMaterial = new THREE.MeshPhongMaterial( { map:  this.bodyTexture, specular: 0xffffff, shininess: 15} );
        this.headTexture = loader.load ( 'imgs/head.JPG' );
        this.headMaterial = new THREE.MeshPhongMaterial( { map:  this.headTexture, specular: 0xffffff ,shininess: 15} );

        this.model = this.createModel();

        this.add(this.model);
    }

    createArm(){
        var foot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5,1,1,4,1,false),
            this.blueMaterial
            );

        foot.position.y = 0.5;
        foot.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(0.79));

        var leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25,0.25,1,8,1,true),
            this.bodyMaterial
        );

        leg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0.5, 0));
        leg.scale.y = 5;
        this.legs.push(leg);

        var shoulder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35,0.35,1.25,8,1,false),
            this.blueMaterial
        );

        shoulder.position.y = 5;
        shoulder.rotation.z = 1.57;

        this.shoulders.push(shoulder);

        foot.add(shoulder);
        foot.add(leg);
        return foot;
    }

    createArms(height){
        this.arms = new THREE.Mesh();
        var left = this.createArm(height);
        var right = this.createArm(height);

        left.position.x = -2.5;
        right.position.x = 2.5;

        this.arms.add(left);
        this.arms.add(right);
        return this.arms;
    }

    createHead(){

        this.head = new THREE.Mesh(
            new THREE.SphereGeometry(2,16,14,0,6.3,0,1.6),
            this.headMaterial
        );

        //            new THREE.CylinderGeometry(0.5,0.5,1,16,1,false),

        var eye = new THREE.Mesh(
            new THREE.SphereGeometry(0.35,16,14,0,6.3,0,1.6),
            this.blackMaterial
        );

        eye.rotation.x = 1.57;
        eye.position.y = 1;
        eye.position.z = 1.6;

        this.head.add(eye);

        return this.head;
    }

    createBody(){
        this.body = new THREE.Mesh(
            new THREE.CylinderGeometry(2,2,4,16,1,false),
            this.bodyMaterial
        );

        this.body.geometry.translate(0,-2,0);
        this.body.add(this.createHead());

        this.body.position.y = 1;

        return this.body;
    }

    createModel(){
        this.model = new THREE.Mesh();
        this.createBody();
        this.body.position.y = 6;
        this.model.add(this.body);
        this.model.add(this.createArms());
        return this.model;
    }

    setHeight(height){
        if(height>=0 && height<=2){
            this.body.position.y = height + 5;
            for(var i =0;i<this.shoulders.length;i++)
                this.shoulders[i].position.y = height + 4;
            for(var i =0;i<this.legs.length;i++)
                this.legs[i].scale.y = height + 4 ;
        }
    }

    setHeadRotation(angle){
        if(angle>=-1.4 && angle<=1.4)
            this.head.rotation.y = angle;
    }

    setBodyRotation(angle){
        if(angle>=-0.75 && angle<=0.5)
            this.body.rotation.x = angle;
    }

}