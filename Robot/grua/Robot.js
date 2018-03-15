//made by gorgue

class Robot extends THREE.Object3D {
    constructor(parameters){
        super();

        this.height = null;
        this.arms = null;
        this.shoulder = null;
        this.leg = null;

        this.body = null;
        this.head = null;

        this.material = new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70});

        this.arms = this.createArms(5);
        this.head = this.createHead();
        this.body = this.createBody();
        this.add(this.arms);
        this.add(this.head);
        this.add(this.body);
    }

    createArm(height){
        var foot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5,1,1,4,1,false),
            this.material
            );

        foot.position.y = 0.5;
        foot.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(0.79));

        var leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25,0.25,height,8,1,false),
            this.material
        );

        leg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, height/2, 0));

        var shoulder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35,0.35,1.25,8,1,false),
            this.material
        );

        shoulder.position.y = height;
        shoulder.rotation.z = 1.57;

        foot.add(shoulder);
        foot.add(leg);
        return foot;
    }

    createArms(height){
        var arms = new THREE.Object3D();
        var left = this.createArm(height);
        var right = this.createArm(height);

        left.position.x = -2.5;
        right.position.x = 2.5;

        arms.add(left);
        arms.add(right);
        return arms;
    }

    createHead(){

        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1,16,14,0,6.3,0,1.6),
            this.material
        );

        var h = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25,0.25,0.5,16,1,false),
            this.material
        );

        h.rotation.x = 1.57;
        h.position.y = 0.5;
        h.position.z = 0.7;

        sphere.add(h);
        sphere.scale.x = 2 ;
        sphere.scale.y = 2 ;
        sphere.scale.z = 2 ;

        return sphere;
    }

    createBody(){
        var b = new THREE.Mesh(
            new THREE.CylinderGeometry(2,2,4,16,1,false),
            this.material
        );

        b.position.y = 4;
        this.head.position.y = 6;
        b.add(this.head);

        return b;
    }


}