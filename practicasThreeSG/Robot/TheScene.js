
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

    this.ovobu = null;
    this.ovoma = null;


    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();

    /*
    this.ground.body.addEventListener("collide",function(e){
        console.log("The sphere just collided with the ground!");
        console.log("Collided with body:",e.body);
        console.log("Contact between bodies:",e.contact);
    });*/

    this.add (this.model);
  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (60, 30, 60);
    var look = new THREE.Vector3 (0,20,0);
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
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);
    
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 60, 60, 40 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048
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
    var textura = loader.load ("imgs/wood.jpg");
    this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial ({map: textura}), 4);

    this.robot = new Robot();

      this.ovobu = new OvoBu();
      this.ovoma = new OvoMa();


      this.ovobu.position.x = 10;
      this.ovoma.position.z = 10;

      this.ovobu.position.y = 25;
      this.ovoma.position.y = 25;

    //  model.add (this.ground);
    //model.add(this.robot);
    this.robot.position.y = 25;
    this.add(this.robot);
    //this.ground.updatePhysicPosition();
    this.add(this.ground);
    this.add(this.ovobu);
    this.add(this.ovoma);
    //model.add(this.ovobu);
    //model.add(this.ovoma);
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
    this.spotLight.intensity = (controls.turnLight === true ? controls.lightIntensity : 0);
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


