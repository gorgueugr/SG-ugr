
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends Physijs.Scene {
  
  constructor (renderer) {
    super();

    this.numeroGolpes = 0;
      // Attributes
      //Gravity of physic world
      this.setGravity(new THREE.Vector3( 0, -40, 0 ));

      this.background = new THREE.Color( 0x777777 );
      this.sunSphere = null;
      this.water = null;
      this.terrainScene = null;
      this.tree = null;
      this.player = null;
      this.ball = null;

      this.clock = new THREE.Clock();
      this.mixers = [];

      this.add(new THREE.AxisHelper(20));
      this.initSky();
      this.createCamera (renderer);

      //this.createMap('imgs/prueba.png','imgs/grassGround1.jpg');
      //this.createGrass();

      //this.createLights ();
        this.createWater();

      this.mapa = new Mapa(this);
      this.meta = new Meta(this,500,-65,-700,10)

      //this.add(this.mapa);

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
  Colisiones(){
      //Detectores de colisiones
      var that = this;
      floor.map.addEventListener("collide",function (e) {
          var map = e.map;
          var o = that.getObjectFromBody(map);
          if(o instanceof Robot){//Suelo choca con robot
              that.reset();
          }
      });

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

    changeCamera(){
        if(this.actualView == this.view){
            this.actualView = this.player.view;
            return;
        }
        this.actualView = this.view;
    }

  initSky(){

      //Sky  FROM https://threejs.org/examples/?q=sky#webgl_shaders_sky
      //
      //Water From https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html



      // Add Sky
      var sky = new THREE.Sky();

      sky.scale.setScalar( 4096 );
      this.add( sky );

      // Add Sun Helper
      var sunSphere = new THREE.Mesh(
          new THREE.SphereBufferGeometry( 20000, 16, 8 ),
          new THREE.MeshBasicMaterial( { color: 0xffffff } )
      );

      sunSphere.position.y = - 700000;
      sunSphere.visible = true;

      var sunLight =   new THREE.DirectionalLight({ color: 0xffff99 });
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 512;  // default
      sunLight.shadow.mapSize.height = 512; // default
      sunLight.shadow.camera.near = 0.5;    // default
      sunLight.shadow.camera.far = 500;     // default
      //sunSphere.add(sunLight);

      sunSphere.castShadow = true;
      sunSphere.receiveShadow = true;

      //var helper  = new THREE.DirectionalLightHelper(sunLight,100,0xff0000);
      //this.add(helper);
      this.add(sunLight);

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
          sun: false
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
      sunLight.position.copy(sunSphere.position);
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
      //Actualizar normales del agua
      if(this.water != null){
          this.water.material.uniforms.sunDirection.value.copy( this.sunSphere.position ).normalize();
          this.water.material.uniforms.time.value += 1.0 / 60.0;
      }

      //Para que el player no rote dentro de las fisicas
      //if(this.player.physic != null)
       //   this.player.physic.__dirtyRotation = true;


      //Para las animaciones
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
     var view =  this.getActualView();
     view.camera.aspect = anAspectRatio;
      view.camera.aspect.updateProjectionMatrix();
  }
  createWater() {

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


        this.water.position.y = -95;
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
        this.player = new Player(this);
        this.ball = new Ball(this);
    }

    hitAnimation(){

      this.numeroGolpes = this.numeroGolpes+1;
      this.player.stopAnimation();
      var pre = this.player.animate("preHit");
      //action.resetDuration();
      //action.paused = true;
        //this.ball.tirar();
      var that = this;


        var fin = function (e) {

                that.player.physic.setLinearFactor(new THREE.Vector3(1, 1, 1));
                that.ball.model.setLinearFactor(new THREE.Vector3(1, 1, 1));
                that.player.stopAnimation();
                that.player.animate("postHit");
                that.ball.tirar();

                that.player.mixer.removeEventListener("finished",fin);


        };
      this.player.mixer.addEventListener("finished",fin);

    }


    prepareHit(){
        var v = this.ball.model.getLinearVelocity();
        console.log("V:",v);
        if( v.x >0.05 || v.y >0.05 || v.z >0.05 || v.x <-0.05 || v.y <-0.05 || v.z <-0.05 ) return;

        this.actualView = this.ball.view;
        this.ball.settingMode();
        var pos = this.ball.playerPos.getWorldPosition();
        this.player.physic.position.copy(pos);
        this.player.physic.setLinearFactor(new THREE.Vector3(0,0,0));
        this.ball.model.setLinearFactor(new THREE.Vector3(0,0,0));

        //this.player.physic.add(this.ball.model);
        // this.ball.model.position.copy(pos);


        this.player.physic.__dirtyPosition = true;
        applicationMode = TheScene.SETTING_HIT;
    }


    forward(){
        switch (applicationMode){
            case TheScene.NO_ACTION:
                this.player.forward();
                break;
            case TheScene.SETTING_HIT:
                this.ball.forward();
                break;
        }
    }

    backward(){
        switch (applicationMode){
            case TheScene.NO_ACTION:
                this.player.backward();
                break;
            case TheScene.SETTING_HIT:
                this.ball.backward();
                break;
        }
    }

    right(){
        switch (applicationMode){
            case TheScene.NO_ACTION:
                this.player.right();
                break;
            case TheScene.SETTING_HIT:
                this.ball.right();
                break;
        }
    }

    left(){
        switch (applicationMode){
            case TheScene.NO_ACTION:
                this.player.left();
                break;
            case TheScene.SETTING_HIT:
                this.ball.left();
                break;
        }
    }

    stop(){
        switch (applicationMode){
            case TheScene.NO_ACTION:
                this.player.stopPlayer();
                break;
            case TheScene.SETTING_HIT:
                this.ball.stop();
                break;
        }
    }



    tirar(){
      if(applicationMode != TheScene.SETTING_HIT)
        return;
      this.hitAnimation();
      //this.ball.tirar();
    }


}


TheScene.NO_ACTION = 0;
TheScene.PLAYER_MOVE = 1;
TheScene.SETTING_HIT = 2;



