class Mapa {
    constructor (scene) {

        this.pelota=null;
        this.meta_salida = new Zona('imgs/green2.png','imgs/cespedClaro.jpg',0.35,0.4,scene);
        this.bunker = new Zona('imgs/bunkers.png','imgs/grassGround.jpg',0.99,0.1,scene);
        this.calle = new Zona('imgs/calle.png','imgs/grassGround1.jpg',0.6,0.7,scene);
        this.frontera = new Zona('imgs/exteriores.png','imgs/groundTierra.jpg',0.8,0.3,scene);

    }
}


class Zona{

    constructor (ruta_heightmap,ruta_textura,rozamiento,bote,scene) {

        this.heightmap = null;
        this.material_zona = null;
        this.terreno = null;
        this.ground_zona = null;

        this.loadHeightMap(ruta_heightmap,ruta_textura,rozamiento,bote,scene);

    }

    loadHeightMap(ruta_heightmap,ruta_textura,rozamiento,bote,scene){
        ///Inicializacion calle
        var heightmap = new Image();
        var that = this;
        heightmap.onload = function () {
            that.loadTerreno(ruta_textura,rozamiento,bote,scene);
        };
        heightmap.src = ruta_heightmap;
        this.heightmap = heightmap;
    }

    loadTerreno(ruta_textura,rozamiento,bote,scene){



        var xS = 64, yS = 64;
        this.terreno = THREE.Terrain({
            //easing: THREE.Terrain.Linear,
            useBufferGeometry: false,
            frequency: 2.5,
            //heightmap: THREE.Terrain.DiamondSquare,
            heightmap:  this.heightmap,
            material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
            maxHeight: 100,
            minHeight: -100,
            steps: 1,
            xSegments: xS,
            xSize: 2048,
            ySegments: yS,
            ySize: 2048,
        });


        this.terreno.receiveShadow = true;
        this.terreno.castShadow = true;
        var loader = new THREE.TextureLoader();

        var textura= loader.load (ruta_textura); //textura calle
        textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
        textura.repeat = new THREE.Vector2(32,32);

        this.material_zona = new Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map:textura}),
            rozamiento, // high friction
            bote //  restitution
        );

        this.ground_zona = new Physijs.HeightfieldMesh(
            this.terreno.children[0].geometry,
            this.material_zona,
            0 //mass
        );

        this.ground_zona.rotation.x = -0.5 * Math.PI;

        scene.add(this.ground_zona);
        console.log("Mapa inicializado en Zona "+ruta_textura);
        console.log(this.terreno);

    }
}


class Meta{
    constructor(scene,x,y,z,radio){
        this.cilindro = new Physijs.CylinderMesh(
            new THREE.CylinderGeometry(radio,radio,1,20,1),
            new THREE.MeshStandardMaterial({color: 0xffffff}),
            1
        );
        this.cilindro.position.x = x ;
        this.cilindro.position.y = y ;
        this.cilindro.position.z = z ;

        scene.add(this.cilindro);

        //Hay que hacer colision Si toca BALL

        


        //-----------------------------------
    }



}

