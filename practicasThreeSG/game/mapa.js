class Mapa {
    constructor (scene) {

        this.heightmap_calle = null;
        this.heightmap_bunker = null;
        this.heightmap_bosque = null;
        this.heightmap_green = null;


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

        this.pelota=null;

        this.createMap(scene);
    }

    loadImage(scene){
        ///Inicializacion calle
        var heightmap_calle = new Image();
        var that = this;
        heightmap_calle.onload = function () {
            that.iniciaZonas(scene);
        };
        heightmap_calle.src = 'imgs/prueba.png';
        this.heightmap_calle = heightmap_calle;

        ///Inicializacion calle
        var heightmap_bunquer = new Image();
        var that = this;
        heightmap_bunquer.onload = function () {
            that.iniciaZonas(scene);
        };
        heightmap_bunquer.src = 'imgs/bunkerPhotoS.png';
        this.heightmap_bunker = heightmap_bunquer;
    }
    iniciaZonas(scene){
        ////////CALLE//////////////////////////

        var xS = 64, yS = 64;
        this.terreno_calle = THREE.Terrain({
            easing: THREE.Terrain.Linear,
            useBufferGeometry: false,
            frequency: 2.5,
            //heightmap: THREE.Terrain.DiamondSquare,
            heightmap:  this.heightmap_calle,
            material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
            maxHeight: 100,
            minHeight: -100,
            steps: 1,
            xSegments: xS,
            xSize: 1024,
            ySegments: yS,
            ySize: 1024,
        });


        this.terreno_calle.receiveShadow = true;
        this.terreno_calle.castShadow = true;
        var loader = new THREE.TextureLoader();

        var textura_calle= loader.load ("imgs/grassGround1.jpg"); //textura calle
        textura_calle.wrapS = textura_calle.wrapT = THREE.RepeatWrapping;
        textura_calle.repeat = new THREE.Vector2(32,32);

        this.material_calle = new Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map:textura_calle}),
            .8, // high friction
            0.6 //  restitution
        );

        this.ground_calle = new Physijs.HeightfieldMesh(
            this.terreno_calle.children[0].geometry,
            this.material_calle,
            0 //mass
        );

        this.ground_calle.rotation.x = -0.5 * Math.PI;
        scene.add(this.ground_calle);

        console.log("mapa añadido");
        console.log(this.terreno_calle);
        ///////////////////////////////////Bunker//////////////////////

        this.terreno_bunker = THREE.Terrain({
            easing: THREE.Terrain.Linear,
            useBufferGeometry: false,
            frequency: 2.5,
            //heightmap: THREE.Terrain.DiamondSquare,
            heightmap:  this.heightmap_bunker,
            material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
            maxHeight: 100,
            minHeight: -100,
            steps: 1,
            xSegments: xS,
            xSize: 1024,
            ySegments: yS,
            ySize: 1024,
        });


        this.terreno_bunker.receiveShadow = true;
        this.terreno_bunker.castShadow = true;
        var loader = new THREE.TextureLoader();

        var textura_bunker= loader.load ("imgs/grassGround.jpg"); //textura bunker
        textura_bunker.wrapS = textura_bunker.wrapT = THREE.RepeatWrapping;
        textura_bunker.repeat = new THREE.Vector2(32,32);

        this.material_bunker = new Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map:textura_bunker}),
            .8, // high friction
            0.6 //  restitution
        );

        this.ground_bunker = new Physijs.HeightfieldMesh(
            this.terreno_bunker.children[0].geometry,
            this.material_bunker,
            0 //mass
        );

        this.ground_bunker.rotation.x = -0.5 * Math.PI;
        scene.add(this.ground_bunker);

        console.log("mapa añadido");
        console.log(this.terreno_bunker);


    }

    createMap(scene) {
        this.loadImage(scene);
        //this.iniciaZonas(scene);
        //this.creaAgua(scene);
        this.pelota = new Physijs.BoxMesh(
            new THREE.SphereGeometry(20,100,100),
            new THREE.MeshStandardMaterial({color: 0xffffff}),
            5000
        );

        this.pelota.position.y = 300;
        this.pelota.castShadow = true;
        this.pelota.receiveShadow = true;

        scene.add(this.pelota);
        this.pelota = new Physijs.BoxMesh(
            new THREE.SphereGeometry(20,100,100),
            new THREE.MeshStandardMaterial({color: 0xffffff}),
            5000
        );

        this.pelota.position.y = 200;
        this.pelota.castShadow = true;
        this.pelota.receiveShadow = true;

        scene.add(this.pelota);

    }
    creaAgua(scene){
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
        scene.add(this.water);
    }
}