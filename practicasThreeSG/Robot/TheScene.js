
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends WorldScene {
  
  constructor (renderer) {
    super();
    
    // Attributes
      //Gravity of physic world
      this.world.gravity.set(0,-9.82,0);
    
    this.ambientLight = null;

    this.ovo = []; //Flying objects

    this.difficulty = 1; //Difficulty

    this.points = 0;  //Player points

    this.color = 0x00ff00;

    this.spotLight = null;

    this.camera = null;
    this.scenicCamera = null;

    this.trackballControls = null;
    this.listener = null;
    //Objects
    this.ground = null;
    this.robot = null;

    this.volume = 0.2;

    this.meta = null;
    this.walll = null;
    this.wallr = null;

    this.view = null;
    this.actualView = null;

    this.createLights ();
    this.createCamera (renderer);

    //this.axis = new THREE.AxisHelper (25);
    //this.add (this.axis);

    this.model = this.createModel ();
    this.add (this.model);

    this.model.castShadow = true;
    this.model.receiveShadow = true;


    this.createAudio();

    this.setColor();
    this.generateSkyBox();
    this.generateOvo(50);
  }

  createAudio(){
      this.listener = new THREE.AudioListener();
      this.add( this.listener );

      // create a global audio source
      this.sound = new THREE.Audio( this.listener );
      this.goodSound = new THREE.Audio( this.listener );
      this.badSound = new THREE.Audio( this.listener );

      // load a sound and set it as the Audio object's buffer
      var audioLoader = new THREE.AudioLoader();
      var that = this;
      audioLoader.load( 'sounds/music.mp3', function( buffer ) {
          that.sound.setBuffer(buffer);
          that.sound.setLoop(true);
          that.sound.setVolume(that.volume);
          that.sound.play();
      });

      audioLoader.load( 'sounds/good.mp3', function( buffer ) {
          that.goodSound.setBuffer(buffer);
          that.goodSound.setLoop(false);
          that.goodSound.setVolume(that.volume);
      });

      audioLoader.load( 'sounds/bad.mp3', function( buffer ) {
          that.badSound.setBuffer(buffer);
          that.badSound.setLoop(false);
          that.badSound.setVolume(that.volume);
      });
  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (-150,120,0);
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
      //var ambient = new THREE.AmbientLight( 0x777777, 0.3 );
      //this.add(ambient);

     // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
     // directionalLight.castShadow = true;
      //this.add(directionalLight);

      //this.statusLight = new THREE.PointLight(0xff0000,1);
      //this.statusLight.position.set(0,-50,0);

      //this.add( this.statusLight );


      var spotLight = new THREE.SpotLight( 0xffffff, 0.2 );
      spotLight.target = new THREE.Object3D();
      spotLight.position.set( -50, 100, 0 );
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.05;
      spotLight.decay = 2;
      spotLight.distance = 500;
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 1;
      this.add( spotLight );

  }
  
  /// It creates the geometric model: crane and ground
  /**
   * @return The model
   */
  createModel () {
    var model = new THREE.Object3D();
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/ground.jpg");
      textura.wrapS = THREE.RepeatWrapping;
      textura.wrapT = THREE.RepeatWrapping;
      textura.repeat.set( 4, 2 );

      var nave = loader.load("imgs/nave.png");
      nave.wrapS = THREE.RepeatWrapping;
      nave.wrapT = THREE.RepeatWrapping;
      nave.repeat.set( 4, 1 );

      var wallGeometry = new THREE.BoxGeometry(1,45,150);
      var wallMaterial = new THREE.MeshPhongMaterial({map:nave});
      var wallPhysic = new CANNON.Box(new CANNON.Vec3(0.1,1000,1000));

      //Walls to detect collisions with Flying objects to reset its position
      var wallMass = 0;
      this.walll = new PhysicMesh(
          wallGeometry,
          new THREE.MeshStandardMaterial(),
          wallPhysic,
          wallMass
      );

      this.wallr = new PhysicMesh(
          wallGeometry,
          wallMaterial,
          wallPhysic,
          wallMass
      );

      //ESto se hace debido a que cannon no detecta colisiones entre
      // Kinematics bodies y al generar un body con masa 0 le atribuye kinematic por defecto
      this.walll.body.type = CANNON.Body.DYNAMIC;
      this.wallr.body.type = CANNON.Body.DYNAMIC;
      //
      this.walll.position.x = -90;
      this.walll.visible = false;
      this.wallr.position.x = 200;
      this.wallr.visible = true;


      this.add(this.walll);
      this.add(this.wallr);
      //__

      this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial({map: textura}), 4);


      //Linea de meta cambia su color segun puntos
      var meta = new PhysicMesh(
          new THREE.BoxGeometry(10,1,75),
          new THREE.MeshLambertMaterial({color: 0xffffff,emissive:0x0000ff}),
          new CANNON.Box(new CANNON.Vec3(5,1,75)),
          0
      );



      meta.body.type = CANNON.Body.DYNAMIC;

      meta.position.x = 80;
      meta.position.y = -0.5;

      this.meta = meta;
      //__Meta

      //Suelo bajo ground para detectar caidas del robot del ground
      var floor = new PhysicMesh(
          new THREE.BoxGeometry(1,1,1),
          new THREE.MeshBasicMaterial(),
          new CANNON.Box(new CANNON.Vec3(1000,1,1000)),
          0
      );
      floor.body.type = CANNON.Body.DYNAMIC;

      floor.position.y = -5;
      //__Floor

      this.robot = new Robot();
    this.robot.position.y = 15;
    this.robot.rotation.y = 1.57;

    this.add(floor);
    this.add(meta);
    this.add(this.robot);
    this.add(this.ground);

    //Detectores de colisiones
      var that = this;
      floor.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof Robot){//Suelo choca con robot
              that.reset();
          }
      });

      meta.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof Robot){ //Meta choca con robot
             that.reset();
          }
      });


      this.wallr.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof OvoBu){ //PAred derecha choca con OvoBu
              //console.log("Wallr choca con " + o.constructor.name);
              o.reset();
          }
      });

      this.walll.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof OvoMa){ //PAred derecha choca con OvoMa
              //console.log("Walll choca con " + o.constructor.name);
              o.reset();
          }
      });

      this.robot.body.addEventListener("collide",function (e) {
          var body = e.body;

          var o = that.getObjectFromBody(body);
          if(o instanceof Ovolador){ //OVO choca con robot
              if(o instanceof OvoMa){
                  that.robotToBack();
                  that.minusPoint();
                  that.setColor();
                  that.robot.animationHead();
                  that.badSound.play();
              }
              else{
                  that.robotToFront();
                  that.robot.animationJump();
                  that.addPoint();
                  that.setColor();
                  that.goodSound.play();

              }
              //console.log("Robot choca con " + o.constructor.name);
              o.reset();
          }
      });

    return model;
  }
  // Public methods

  /// It sets the crane position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {
      //console.log(this.volume);
      if(this.difficulty != controls.difficulty){ //Si se cambia de dificultad se reinicia
          this.difficulty = controls.difficulty;
          this.reset();
      }
      this.volume = controls.volume.toFixed(1);
      this.sound.setVolume( this.volume );
      this.goodSound.setVolume( this.volume );
      this.badSound.setVolume( this.volume );

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

  generateOvoBu(x,y,z,d){
      var ovobu = new OvoBu();
      var xyz = new THREE.Vector3(x,y,z);

      ovobu.position.copy(xyz);
      ovobu.initPosition.copy(xyz);
      ovobu.difficulty = d;

      this.ovo.push(ovobu);
      this.add(ovobu);
  }
  generateOvoMa(x,y,z,d){
      var ovoma = new OvoMa();
      var xyz = new THREE.Vector3(x,y,z);

      ovoma.position.copy(xyz);
      ovoma.initPosition.copy(xyz);
      ovoma.difficulty = d;

      this.ovo.push(ovoma);
      this.add(ovoma);
  }

  generateOvo(n){
      var b = 0.2*n;
      var m = 0.8*n;
      var min = -100;
      var max = 100;
      var distance  = max - min;
      var bStep = distance/b;
      var mStep = distance/m;

      for(var i=min+bStep;i<max;i+=mStep)
          this.generateOvoBu(-150,7,i,this.difficulty);

      for(var i=min+mStep;i<max;i+=mStep)
          this.generateOvoMa(200,3,i,this.difficulty);
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

  robotToLeft(){
      var force = this.robot.body.velocity;
      //console.log(force);
      if(force.x == 0 && Math.round(force.y) == 0 && force.z == 0){ //Si el robot esta estatico
          //this.robot.body.applyImpulse(new CANNON.Vec3(0,0,-1.5),new CANNON.Vec3(0,0,0));
          this.robot.position.z = this.robot.position.z - 3;
          this.robot.updatePhysicPosition();
      }
  }

  robotToRight(){
      var force = this.robot.body.velocity;
      //console.log(force);
      if(force.x == 0 && Math.round(force.y) == 0 && force.z == 0){ //Si el robot esta estatico
          //this.robot.body.applyImpulse(new CANNON.Vec3(0,0,-1.5),new CANNON.Vec3(0,0,0));
          this.robot.position.z = this.robot.position.z + 3;
          this.robot.updatePhysicPosition();
      }


  }

  robotToFront(){
      //this.robot.body.applyImpulse(new CANNON.Vec3(6,0,0),new CANNON.Vec3(0,0,0));

      this.robot.position.x = this.robot.position.x + 3;
      this.robot.updatePhysicPosition();

  }
  robotToBack(){
      //this.robot.body.applyImpulse(new CANNON.Vec3(-2,0,0),new CANNON.Vec3(0,0,0));

      this.robot.position.x = this.robot.position.x - 9 * this.difficulty;
      this.robot.updatePhysicPosition();


  }

  robotJump(){
      var force = this.robot.body.velocity;
      //console.log(force);
      if(force.x == 0 && Math.round(force.y) == 0 && force.z == 0 && this.points == 10) { //Si el robot esta estatico
          // y tenemos 10 puntos
          this.robot.animationJump();
          this.robot.body.applyImpulse(new CANNON.Vec3(0, 10, 0), new CANNON.Vec3(0, 0, 0));
      }
  }

    changeCamera(){
      if(this.actualView == this.view){
          this.actualView = this.robot.view;
          return;
      }
        this.actualView = this.view;
    }

    setColor(){ //Cambia el color de la meta
      var hex = 0x000000;
        //console.log(this.points);
        switch(this.points){
            case 0:
             hex= 0xff0000;
                break;
            case 1:
                hex= 0xff3300;
                break;
            case 2:
                hex= 0xff6600;
                break;
            case 3:
                hex= 0xffcc66;
                break;
            case 4:
                hex= 0xffcc00;
                break;
            case 5:
                hex= 0xffff99;
                break;
            case 6:
                hex= 0xffff66;
                break;
            case 7:
                hex= 0xccff99;
                break;
            case 8:
                hex= 0xccff66;
                break;
            case 9:
                hex= 0x99ff33;
                break;
            case 10:
                hex= 0x0000ff;
                break;
        }
        //console.log(this.meta.material.color);
        this.meta.material.emissive.setHex(hex);
        this.meta.material.color.setHex(hex);
    }

    addPoint(){
        this.points = this.points >= 9 ? 10:this.points+=1;

    }

    minusPoint(){
        this.points = this.points <= 3 ? 0:this.points-=3;
    }

    reset(){ //Reinicia partida
      this.robot.reset();
      this.points = 0;
      this.setColor();
      for(var i=0;i<this.ovo.length;i++){
          this.ovo[i].difficulty = this.difficulty;
          this.ovo[i].reset();
      }
    }
}



