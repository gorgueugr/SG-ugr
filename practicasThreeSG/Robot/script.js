
/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

/// The current mode of the application
applicationMode = TheScene.NO_ACTION;

//debug
cannonDebugRenderer = null;
/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    this.axis = true;
    this.turnLight = true;
    this.lightIntensity = 0.5;
    //Robot
    this.rotation = 0.0;
    this.rotationBody = 0.0;
    this.height   = 0.0;
    //
    this.addBox   = function () {
      setMessage ("Añadir cajas clicando en el suelo");
      applicationMode = TheScene.ADDING_BOXES;
    };
    this.moveBox  = function () {
      setMessage ("Mover y rotar cajas clicando en ellas");
      applicationMode = TheScene.MOVING_BOXES;
    };
  }
  
  var gui = new dat.GUI();
  var axisLights = gui.addFolder ('Axis and Lights');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(GUIcontrols, 'turnLight').name('Turn light on/off :');
    axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');
  
  var actions = gui.addFolder ('Actions');
    var addingBoxes = actions.add(GUIcontrols, 'addBox').name (': Adding boxes :');
    var movingBoxes = actions.add (GUIcontrols, 'moveBox').name (': Move and rotate boxes :');

    var robot = gui.addFolder('Robot');
      robot.add(GUIcontrols, 'height', 0, 2.0).name(':Altura del robot :');
      robot.add(GUIcontrols, 'rotation', -1.4, 1.4).name(':Cabeza del robot :');
      robot.add(GUIcontrols, 'rotationBody', -0.75, 0.5).name(':Cuerpo del robot :');

    if (withStats)
    stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {
  
  var stats = new Stats();
  
  stats.setMode(0); // 0: fps, 1: ms
  
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  
  $("#Stats-output").append( stats.domElement );
  
  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}

/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    //scene.getCameraControls().enabled = true;
  } else {  
    scene.getCameraControls().enabled = false;
    if (event.button === 0) {   // Left button
      mouseDown = true;
      switch (applicationMode) {
        case TheScene.ADDING_BOXES :
          scene.addBox (event, TheScene.NEW_BOX);
          break;
        case TheScene.MOVING_BOXES :
          scene.moveBox (event, TheScene.SELECT_BOX);
          break;
        default :
          applicationMode = TheScene.NO_ACTION;
          break;
      }
    } else {
      setMessage ("");
      applicationMode = TheScene.NO_ACTION;
    }
  }
}

/// It processes the drag of the mouse
/**
 * @param event - Mouse information
 */
function onMouseMove (event) {
  if (mouseDown) {
    switch (applicationMode) {
      case TheScene.ADDING_BOXES :
      case TheScene.MOVING_BOXES :
        scene.moveBox (event, TheScene.MOVE_BOX);
        break;
      default :
        applicationMode = TheScene.NO_ACTION;
        break;
    }
  }
}

/// It processes the clic-up of the mouse
/**
 * @param event - Mouse information
 */
function onMouseUp (event) {
  if (mouseDown) {
    switch (applicationMode) {
      case TheScene.ADDING_BOXES :
        scene.addBox (event, TheScene.END_ACTION);
        break;
      case TheScene.MOVING_BOXES :
        scene.moveBox (event, TheScene.END_ACTION);
        break;
      default :
        applicationMode = TheScene.NO_ACTION;
        break;
    }
    mouseDown = false;
  }
}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    //scene.getCameraControls().enabled = true;
  } else {  
    scene.getCameraControls().enabled = false;
    if (mouseDown) {
      switch (applicationMode) {
        case TheScene.MOVING_BOXES :
          scene.moveBox (event, TheScene.ROTATE_BOX);
          break;
      }
    }
  }
}

function onKeyPress(event) {
    if(scene.isRobotFlying()){
      return;
    }
    var keyCode = event.key;
    keyCode = keyCode.toLowerCase();
    //console.log(keyCode);
    switch (keyCode) {
        case "a": //A
            scene.robotToLeft();
          break;
        case "d": //D
            scene.robotToRight();
            break;
        case "v": //W
            scene.changeCamera();
          break;
        case "s": //D
            //scene.robotToBack();
          break;
    }
}


/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;  
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);
  
  stats.update();
  scene.getCameraControls().update ();
  scene.animate(GUIcontrols);
  scene.updatePhysics();
  //cannonDebugRenderer.update();      // Update the debug renderer
    TWEEN.update();
  renderer.render(scene, scene.getCamera());
}


/// The main function
$(function () {


  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("mouseup", onMouseUp, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
    window.addEventListener ("keypress", onKeyPress, true);



    // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, scene.world );


    createGUI(true);

  render();
});
