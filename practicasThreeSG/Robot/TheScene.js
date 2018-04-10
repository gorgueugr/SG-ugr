
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

    this.ovobu = [];
    this.ovoma = [];


    this.createLights ();
    this.createCamera (renderer);

    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);

    this.model = this.createModel ();
    this.add (this.model);

    this.generateSkyBox();
    /*
    this.ground.body.addEventListener("collide",function(e){
        console.log("The sphere just collided with the ground!");
        console.log("Collided with body:",e.body);
        console.log("Contact between bodies:",e.contact);
    });*/


  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (0, 60, 60);
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

    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 100, 1000, 100 );
    this.spotLight.castShadow = true;
    this.spotLight.intensity = 2;
    this.spotLight.distance = 2000;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048;
    this.spotLight.shadow.mapSize.height=2048;
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

      this.ground = new Ground (300, 300, new THREE.MeshStandardMaterial({map: textura}), 4);

      this.robot = new Robot();
    //  model.add (this.ground);
    //model.add(this.robot);
    this.robot.position.y = 10;
    this.robot.rotation.y = 1.57;
    this.add(this.robot);
    this.add(this.ground);
    this.generateOvo(2);

    return model;
  }
  // Public methods

  /// It adds a new box, or finish the action
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: start adding or finish.
   */
  addBox (event, action) {
    this.ground.addBox(event, action);
  }
  
  /// It moves or rotates a box on the ground
  /**
   * @param event - Mouse information
   * @param action - Which action is requested to be processed: select a box, move it, rotate it or finish the action.
   */
  moveBox (event, action) {
    this.ground.moveBox (event, action);
  }
  

  /// It sets the crane position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {
    this.axis.visible = controls.axis;
    this.robot.setHeight(controls.height);
    this.robot.setHeadRotation(controls.rotation);
    this.robot.setBodyRotation(controls.rotationBody);

      //this.spotLight.intensity = controls.lightIntensity ;
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


      ovobu.position.x = x;
        ovobu.position.y = y;
      ovobu.position.z = z;
      this.add(ovobu);


  }
  generateOvoMa(x,y,z){
      var ovoma = new OvoMa();
      ovoma.position.x = x;
      ovoma.position.y = y;
      ovoma.position.z = z;

      ovoma.body.addEventListener("collide",function (e) {
          console.log("golpe");
          e.position.x = x;
          e.position.y = y;
          e.position.z = z;
      });
      this.ovoma.push(ovoma);
      this.add(ovoma);
  }

  generateOvo(n){
      for(var i=0;i<n;i++){
          this.generateOvoBu(-100,5,i+1*2);
          this.generateOvoMa(100,5,i+1*-2);
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


