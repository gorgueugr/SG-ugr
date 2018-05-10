class Mapa extends Physijs.Scene{
    constructor (renderer) {
        super();

        // Attributes
        //Gravity of physic world
        this.setGravity(new THREE.Vector3( 0, -30, 0 ));

        this.background = new THREE.Color( 0x777777 );
        this.water = null;
        this.terrainScene = null;
        this.tree = null;


        this.material_calle = null;
        this.material_bunker = null;
        this.material_bosque = null;
        this.material_green = null;

        this.terreno_calle = null;
        this.terreno_bunker = null;
        this.terreno_bosque = null;
        this.terreno_green = null;

        this.ground_calle = null;
        this.ground_bunker = null;
        this.ground_bosque = null;
        this.ground_green = null;

        this.box_calle = null;
        this.box_bunker = null;
        this.box_bosque = null;
        this.box_green = null;

        this.createMap();
    }
    iniciaZonas(){

        ///Inicializacion calle
        var heightmap_calle = new Image();
        heightmap_calle.src = 'imgs/prueba.png';

        var xS = 64, yS = 64;
        this.terreno_calle = THREE.Terrain({
            //easing: THREE.Terrain.Linear,
            //frequency: 2.5,
            //heightmap: THREE.Terrain.DiamondSquare,
            heightmap: heightmap_calle,
            maxHeight: 100,
            minHeight: -10,
            //steps: 5,
            useBufferGeometry: false,
            xSegments: xS,
            xSize: 2048,
            ySegments: yS,
            ySize: 2048,
        });
        this.terreno_calle.receiveShadow = true;
        this.terreno_calle.castShadow = true;
        var loader = new THREE.TextureLoader();

        var textura_calle= loader.load ("imgs/grassGround1.jpg"); //textura calle
        textura_calle.wrapS = textura_calle.wrapT = THREE.RepeatWrapping;
        textura_calle.repeat = new THREE.Vector2(32,32);

        this.material_calle = new THREE.MeshLambertMaterial({map:textura_calle});


        this.ground_calle = new Physijs.HeightfieldMesh(
            this.terreno_calle.children[0].geometry,
            this.material_calle,
            0 //mass
        );
        this.ground_calle.rotation.x = -0.5 * Math.PI;

        this.add(this.ground_calle);

        this.box_calle = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50,50,50),
            new THREE.MeshStandardMaterial({color: 0x0000ff}),
            10
        );

        this.box_calle.position.y = 200;
        this.box_calle.castShadow = true;
        this.box_calle.receiveShadow = true;

        this.add(this.box_calle);

    }

    createMap() {
        this.iniciaZonas();
        //this.creaAgua();

    }
    creaAgua(){
        var waterGeometry = new THREE.PlaneGeometry(2048, 2048, 16, 16);

        this.water = new THREE.Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'imgs/waternormals.jpg', function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                alpha: 1.0,
                sunDirection: this.sunSphere.position.clone().normalize(),
                sunColor: 0xffffff,
                waterColor: 0x005BC5,
                distortionScale:  3.7,
                fog: this.fog !== undefined
            }
        );


        /*
        var water = new Physijs.PlaneMesh(
            new THREE.PlaneGeometry(2048, 2048, 16, 16),
           new THREE.MeshLambertMaterial({color: 0x006ba0, transparent: true, opacity: 0.6})
            ,0
        );*/


        this.water.position.y = -5;
        this.water.rotation.x = -0.5 * Math.PI;
        //this.water = water;
        this.add(this.water);
    }
}