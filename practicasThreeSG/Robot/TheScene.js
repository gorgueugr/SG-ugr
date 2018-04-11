
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

    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);

    this.model = this.createModel ();
    this.add (this.model);

    this.generateSkyBox();


  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (80,75,0);
    var look = new THREE.Vector3 (0,15,0);
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
    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.add (this.ambientLight);

    var skyLight = new THREE.HemisphereLight(0xffffff,0x777777,0.5);
    this.add(skyLight);
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 100, 100, 100 );
    this.spotLight.castShadow = true;
    this.spotLight.intensity = 2;
    this.spotLight.distance = 200;
    // the shadow resolution
    //this.spotLight.shadow.mapSize.width=2048;
    //this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);
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
      textura.repeat.set( 2, 1 );

      var wallGeometry = new THREE.BoxGeometry(1,150,150);
      var wallMaterial = new THREE.MeshStandardMaterial();
      var wallPhysic = new CANNON.Box(new CANNON.Vec3(1,150,150));
      var wallMass = 0;

      this.walll = new PhysicMesh(
          wallGeometry,
          wallMaterial,
          wallPhysic,
          wallMass
      );

      this.wallr = new PhysicMesh(
          wallGeometry,
          wallMaterial,
          wallPhysic,
          wallMass
      );


      this.walll.body.type = CANNON.Body.DYNAMIC;
      this.wallr.body.type = CANNON.Body.DYNAMIC;

      this.walll.position.x = -90;
      this.walll.visible = false;
      this.wallr.position.x = 90;
      this.wallr.visible = false;

      this.add(this.walll);
      this.add(this.wallr);


      this.ground = new Ground (300, 300, new THREE.MeshStandardMaterial({map: textura}), 4);

      this.robot = new Robot();
    this.robot.position.y = 10;
    this.robot.rotation.y = 1.57;
    this.add(this.robot);
    this.add(this.ground);
    this.generateOvo(7);


      var that = this;


      this.wallr.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof Ovolador){
              console.log("Wallr choca con " + o.constructor.name);
              o.position.copy(o.initPosition);
              o.applyVelocity();
              o.updatePhysicPosition();
          }
      });

      this.walll.body.addEventListener("collide",function (e) {
          var body = e.body;
          var o = that.getObjectFromBody(body);
          if(o instanceof Ovolador){
              console.log("Walll choca con " + o.constructor.name);
              o.position.copy(o.initPosition);
              o.applyVelocity();
              o.updatePhysicPosition();
          }
      });

      this.robot.body.addEventListener("collide",function (e) {
          var body = e.body;

          var o = that.getObjectFromBody(body);
          if(o instanceof Ovolador){
              console.log("Robot choca con " + o.constructor.name);
              o.position.copy(o.initPosition);
              o.applyVelocity();
              o.updatePhysicPosition();
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
    this.axis.visible = controls.axis;
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
      for(var i=0;i<n;i++){
          this.generateOvoBu(-75,3,i*3);
          this.generateOvoMa(75,3,i*3);
      }
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
      this.robot.position.z = this.robot.position.z - 3;
      this.robot.updatePhysicPosition();

  }

  robotToRight(){
      this.robot.position.z = this.robot.position.z + 3;
      this.robot.updatePhysicPosition();

  }

  robotToFront(){
      this.robot.position.x = this.robot.position.x + 3;
      this.robot.updatePhysicPosition();

  }
  robotToBack(){
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


