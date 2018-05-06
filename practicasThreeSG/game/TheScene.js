
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

      this.add(new THREE.AxisHelper(20));
    this.createMap();
    //this.createLights ();
    this.createCamera (renderer);
    this.createModels();
    this.createAudio();
    this.initSky();


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

      //FROM https://threejs.org/examples/?q=sky#webgl_shaders_sky
      //Lack to implement water shader from :
      //
      // https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean2.html
      //https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html



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
      this.add( sunSphere );



      var effectController  = {
          turbidity: 10,
          rayleigh: 2,
          mieCoefficient: 0.005,
          mieDirectionalG: 0.8,
          luminance: 1,
          inclination: 0.26, // elevation / inclination
          azimuth: 0.25, // Facing front,
          sun: true
      };

      var distance = 400000;

      var uniforms = sky.material.uniforms;
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
  generateSkyBox(){
      var materialArray = [];
      var loader = new THREE.TextureLoader();
      var textura = loader.load ("imgs/sky.png");
      for(var i=0;i<7;i++){
          materialArray.push(new THREE.MeshStandardMaterial({map: textura}));
          materialArray[i].side = THREE.BackSide;

      }
      var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
      var skyboxGeom = new THREE.CubeGeometry( 500, 500, 500, 1, 1, 1 );
      var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
      this.add( skybox );
  }

    createMap() {
        //var heightmapImage = new Image();
        //heightmapImage.src = 'imgs/island.jpg';

        var xS = 64, yS = 64;
        var terrainScene = THREE.Terrain({
            easing: THREE.Terrain.Linear,
            frequency: 2.5,
            heightmap: THREE.Terrain.DiamondSquare,
            maxHeight: 100,
            minHeight: -10,
            steps: 5,
            useBufferGeometry: false,
            xSegments: xS,
            xSize: 1024,
            ySegments: yS,
            ySize: 1024,
        });


       terrainScene.receiveShadow = true;
       terrainScene.castShadow = true;


       var ground = new Physijs.HeightfieldMesh(
           terrainScene.children[0].geometry,
            new THREE.MeshLambertMaterial({color: 0xff0000}),
            0 //mass
        );

        ground.rotation.x = -0.5 * Math.PI;
       this.add(ground);

       var box = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50,50,50),
           new THREE.MeshLambertMaterial({color: 0x0000ff}),
           10
       );

       box.position.y = 200;
       box.castShadow = true;

       this.add(box);


        var water = new Physijs.PlaneMesh(
            new THREE.PlaneGeometry(1024, 1024, 16, 16),
           new THREE.MeshLambertMaterial({color: 0x006ba0, transparent: true, opacity: 0.6})
            ,0
        );


        water.position.y = -5;
        water.rotation.x = -0.5 * Math.PI;
        this.add(water);


        //terrainScene.rotation.x = -0.5 * Math.PI;
        //this.add(terrainScene);
    }

    createModels() {

    }
}



