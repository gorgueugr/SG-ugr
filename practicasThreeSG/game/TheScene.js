
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends Physijs.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes
      //Gravity of physic world
      this.setGravity(new THREE.Vector3( 0, -30, 0 ));

      this.background = new THREE.Color( 0x777777 );
    this.sunSphere = null;
      this.water = null;
      this.terrainScene = null;
      this.tree = null;

      this.clock = new THREE.Clock();
      this.mixers = [];


      this.add(new THREE.AxisHelper(20));
      this.initSky();

      this.createMap('imgs/prueba.png','imgs/grassGround1.jpg');
      //this.createMap('imgs/prueba2.png','imgs/grassGround.jpg');
      //this.createGrass();

      //this.createLights ();
    this.createCamera (renderer);
    this.createModels();
    this.createAudio();



    //this.generateSkyBox();

  }

  createAudio(){

  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.position.set (500,750,500);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);

    this.scenicCamera = this.camera;

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;

    this.view = [{
        left: 0,
        top: 0,
        width: 1.0,
        height: 1.0,
        camera: this.scenicCamera
    }];

      this.actualView = this.view;

      this.add(this.camera);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
      var ambient = new THREE.AmbientLight( 0x777777, 1 );
      this.add(ambient);

     // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
     // directionalLight.castShadow = true;
      //this.add(directionalLight);

      //this.statusLight = new THREE.PointLight(0xff0000,1);
      //this.statusLight.position.set(0,-50,0);

      //this.add( this.statusLight );


      var spotLight = new THREE.SpotLight( 0xffffff, 0.9 );
      //spotLight.target = new THREE.Object3D();
      spotLight.position.set( 500, 500, 500 );
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.05;
      spotLight.decay = 2;
      spotLight.distance = 10000;
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 1;
      this.add( spotLight );


  }


  initSky(){

      //Sky  FROM https://threejs.org/examples/?q=sky#webgl_shaders_sky
      //
      //Water From https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html



      // Add Sky
      var sky = new THREE.Sky();

      sky.scale.setScalar( 2048 );
      this.add( sky );

      // Add Sun Helper
      var sunSphere = new THREE.Mesh(
          new THREE.SphereBufferGeometry( 20000, 16, 8 ),
          new THREE.MeshBasicMaterial( { color: 0xffffff } )
      );

      sunSphere.position.y = - 700000;
      sunSphere.visible = true;

      var sunLight = new THREE.DirectionalLight({ color: 0xffffff });
      sunLight.castShadow = true;
      sunSphere.add(sunLight);
      this.sunSphere = sunSphere;
      this.add( this.sunSphere );



      var effectController  = {
          turbidity: 10,
          rayleigh: 2,
          mieCoefficient: 0.005,
          mieDirectionalG: 0.8,
          luminance: 1,
          inclination: 0.25, // elevation / inclination
          azimuth: 0.25, // Facing front,
          sun: true
      };

      var uniforms = sky.material.uniforms;

      /*var pos = { i: 0.5 }; // Start at (0, 0)
      var tween = new TWEEN.Tween(pos) // Create a new tween that modifies 'coords'.
          .to({ i: -0.5 }, 10000) // Move to (300, 200) in 1 second.
          .easing(TWEEN.Easing.Quadratic.InOut)
          .yoyo( true ) // Use an easing function to make the animation smooth.
          .repeat( Infinity )
          .onUpdate(function() { // Called after tween.js updates 'coords'.
              var theta = Math.PI * ( pos.i - 0.5 );
              var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

              sunSphere.position.x = distance * Math.cos( phi );
              sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
              sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
              sunSphere.visible = effectController.sun;
              uniforms.sunPosition.value.copy( sunSphere.position );

          })
          .start(); // Start the tween immediately.*/

      var distance = 400000;

      uniforms.turbidity.value = effectController.turbidity;
      uniforms.rayleigh.value = effectController.rayleigh;
      uniforms.luminance.value = effectController.luminance;
      uniforms.mieCoefficient.value = effectController.mieCoefficient;
      uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

      var theta = Math.PI * ( effectController.inclination - 0.5 );
      var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

      sunSphere.position.x = distance * Math.cos( phi );
      sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
      sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
      sunSphere.visible = effectController.sun;
      uniforms.sunPosition.value.copy( sunSphere.position );

  }

  // Public methods

  /// It sets the crane position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {


  }

  update(){
      if(this.water != null){
          this.water.material.uniforms.sunDirection.value.copy( this.sunSphere.position ).normalize();
          this.water.material.uniforms.time.value += 1.0 / 60.0;
      }

      for ( var i = 0; i < this.mixers.length; i ++ ) {
          this.mixers[ i ].update( this.clock.getDelta() );
      }
  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.camera;
  }

  getView(){
      return this.view;
  }

  getActualView(){
    return this.actualView;
  }
  
  /// It returns the camera controls
  /**
   * @return The camera controls
   */
  getCameraControls () {
    return this.trackballControls;
  }
  
  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }
  createMap(ruta,textura) {
        var heightmapImage = new Image();
        heightmapImage.src = ruta;

        //TODO: Aqui hay algo raro que cuando cargas la prueba tienes qe recargar la pagina para que se vea el map

        var xS = 64, yS = 64;
        var terrainScene = THREE.Terrain({
            //easing: THREE.Terrain.Linear,
            //frequency: 2.5,
            //heightmap: THREE.Terrain.DiamondSquare,
            heightmap: heightmapImage,
            maxHeight: 100,
            minHeight: -10,
            //steps: 5,
            useBufferGeometry: false,
            xSegments: xS,
            xSize: 2048,
            ySegments: yS,
            ySize: 2048,
        });


       terrainScene.receiveShadow = true;
       terrainScene.castShadow = true;
      var loader = new THREE.TextureLoader();

      var textura = loader.load (textura);
        textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
        textura.repeat = new THREE.Vector2(32,32);

       var material = new THREE.MeshLambertMaterial({map:textura});


       var ground = new Physijs.HeightfieldMesh(
           terrainScene.children[0].geometry,
            material,
            0 //mass
        );

        ground.rotation.x = -0.5 * Math.PI;

        this.terrainScene = ground;
       this.add(ground);

       var box = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50,50,50),
           new THREE.MeshStandardMaterial({color: 0x0000ff}),
           10
       );

       box.position.y = 200;
       box.castShadow = true;
       box.receiveShadow = true;

       this.add(box);


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


        //terrainScene.rotation.x = -0.5 * Math.PI;
        //this.add(terrainScene);
    }


    createGrass(){
      var geo = new THREE.PlaneGeometry(10,10);
        geo.applyMatrix(new THREE.Matrix4().makeTranslation(0,1.5,0));

        var mergedGeometry = new THREE.Geometry();

        var loader = new THREE.TextureLoader();
        var textura = loader.load ("imgs/grass2.png");

        var material	= new THREE.MeshPhongMaterial({
            map		: textura,
            alphaTest: 0.2

        });

        material.side = THREE.DoubleSide;

        for(var i = 0;i<10;i++){
                //geo.rotateY(Math.PI * 1 / i);
                //geo.rotateY(0,Math.PI * 1 / i,0);
                //geo.translate(i+1,0,j+1);
            geo.translate(0,0,i+1);
            mergedGeometry.merge(geo);
        }

        var grass = new THREE.Mesh(mergedGeometry,material);


        //TODO: https://stackoverflow.com/questions/30245990/how-to-merge-two-geometries-or-meshes-using-three-js-r71
       // var cube = new THREE.Mesh(new THREE.CubeGeometry(8,8,8),material);


        var loader = new THREE.OBJLoader();

// load a resource
        var that = this;
        loader.load(
            // resource URL
            'obj/lowpolytree.obj',
            // called when resource is loaded
            function ( object ) {

               that.tree = object;
               that.addTrees();

            },
            // called when loading is in progresses
            function ( xhr ) {
            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );

  }

  addTrees(){
      var geoTerrain = this.terrainScene.geometry;

      this.tree.position.y = 10;
      this.tree.updateMatrix();
      this.tree.scale.x = 10;
      this.tree.scale.y = 10;
      this.tree.scale.z = 10;


      var decoScene = THREE.Terrain.ScatterMeshes(geoTerrain, {
          smoothSpread:0,
          mesh: this.tree,
          w: 64,
          h: 64,
          spread: 0.02,
          randomness: Math.random
      });

      this.terrainScene.add(decoScene);
  }

    createModels() {
        var player = new Player(this);

        //player.model.position.y = 200;
        //this.add(player.model);
    }
}



