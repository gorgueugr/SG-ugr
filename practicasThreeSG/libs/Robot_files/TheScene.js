
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends WorldScene {
  
  constructor (renderer) {
    super();
    
    // Attributes
      this.world.gravity.set(0,-9.82,0);
    
    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.trackballControls = null;
    //Objects
    this.ground = null;
    this.robot = null;

    this.walll = null;
    this.wallr = null;

    this.createLights ();
    this.createCamera (renderer);

    //this.axis = new THREE.AxisHelper (25);
    //this.add (this.axis);

    this.model = this.createModel ();
    this.add (this.model);

    this.model.castShadow = true;
    this.model.receiveShadow = true;

    this.generateSkyBox();


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

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;
    
    this.add(this.camera);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
      var ambient = new THREE.AmbientLight( 0xffffff, 0.3 );
      this.add(ambient);

     // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
     // directionalLight.castShadow = true;
      //this.add(directionalLight);


      var spotLight = new THREE.SpotLight( 0xffffff, 0.3 );
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
      // Kinematics bodys y al generar un body con masa 0 le atribuye kinematic por defecto
      this.walll.body.type = CANNON.Body.DYNAMIC;
      this.wallr.body.type = CANNON.Body.DYNAMIC;

      this.walll.position.x = -90;
      this.walll.visible = false;
      this.wallr.position.x = 200;
      this.wallr.visible = true;


      this.add(this.walll);
      this.add(this.wallr);


      this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial({map: textura}), 4);
      //this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial(), 4);
      //this.ground.ground.receiveShadow = true;


      var meta = new PhysicMesh(
          new THREE.BoxGeometry(10,1,75),
          new THREE.MeshStandardMaterial({color: 0xff0000}),
          new CANNON.Box(new CANNON.Vec3(5,1,75)),
          0
      );

        meta.body.type = CANNON.Body.DYNAMIC;

        meta.position.x = 80;
        meta.position.y = -0.5;



      this.robot = new Robot();
    this.robot.position.y = 15;
    this.robot.rotation.y = 1.57;
    this.add(meta);
    this.add(this.robot);
    this.add(this.ground);
    this.generateOvo(50);


      var that = this;

      meta.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          console.log("meta");
          if(o instanceof Robot){
              o.position.copy(new THREE.Vector3(0,5,0));
              o.updatePhysicPosition();
          }
      });

      this.wallr.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof OvoBu){
              //console.log("Wallr choca con " + o.constructor.name);
              o.reset();
          }
      });

      this.walll.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof OvoMa){
              //console.log("Walll choca con " + o.constructor.name);
              o.reset();
          }
      });

      this.robot.body.addEventListener("collide",function (e) {
          var body = e.body;

          var o = that.getObjectFromBody(body);
          if(o instanceof Ovolador){
              if(o instanceof OvoMa)
                  that.robotToBack();
              else{
                  that.robotToFront();
                  that.robot.animationJump();
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
    this.robot.setHeight(controls.height);
    this.robot.setHeadRotation(controls.rotation);
    this.robot.setBodyRotation(controls.rotationBody);
  }

  updateRobotPosition(){
      this.robot.position.z = this.robotZ;
      this.robot.position.x = this.robotX;
      console.log(  this.robot.position.z,  this.robot.position.x);
  }
  
  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.camera;
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

  generateOvoBu(x,y,z){
      var ovobu = new OvoBu();
      var xyz = new THREE.Vector3(x,y,z);

      ovobu.position.copy(xyz);
      ovobu.initPosition.copy(xyz);

      this.add(ovobu);
  }
  generateOvoMa(x,y,z){
      var ovoma = new OvoMa();
      var xyz = new THREE.Vector3(x,y,z);

      ovoma.position.copy(xyz);
      ovoma.initPosition.copy(xyz);

      this.add(ovoma);
  }

  generateOvo(n){
      for(var i=0;i<0.2*n;i++)
          this.generateOvoBu(-150,3,(i*2) - 0.2*n/2);

      for(var i=0;i<0.8*n;i++)
          this.generateOvoMa(200,3,(i*2) - 0.8*n/2);
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

      //this.robot.body.applyImpulse(new CANNON.Vec3(0,0,-1.5),new CANNON.Vec3(0,0,0));
      this.robot.position.z = this.robot.position.z - 3;
      this.robot.updatePhysicPosition();

  }

  robotToRight(){
      //this.robot.body.applyImpulse(new CANNON.Vec3(0,0,1.5),new CANNON.Vec3(0,0,0));

      this.robot.position.z = this.robot.position.z + 3;
      this.robot.updatePhysicPosition();

  }

  robotToFront(){
      //this.robot.body.applyImpulse(new CANNON.Vec3(6,0,0),new CANNON.Vec3(0,0,0));

      this.robot.position.x = this.robot.position.x + 3;
      this.robot.updatePhysicPosition();

  }
  robotToBack(){
      //this.robot.body.applyImpulse(new CANNON.Vec3(-2,0,0),new CANNON.Vec3(0,0,0));

      this.robot.position.x = this.robot.position.x - 3;
      this.robot.updatePhysicPosition();


  }

    isRobotFlying(){
      return this.robot.position.y == 0;
    }

}


  // class variables
  
  // Application modes
  TheScene.NO_ACTION = 0;
  TheScene.ADDING_BOXES = 1;
  TheScene.MOVING_BOXES = 2;
  
  // Actions
  TheScene.NEW_BOX = 0;
  TheScene.MOVE_BOX = 1;
  TheScene.SELECT_BOX = 2;
  TheScene.ROTATE_BOX = 3;
  TheScene.END_ACTION = 10;


