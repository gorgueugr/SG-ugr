
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

rend = true;

start = false;
//debug
cannonDebugRenderer = null;
/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
    GUIcontrols = new function () {
        //

        this.difficulty = 1;
        this.volume = 0.2;
        this.start = function () {
            restart();
        };

    }
        var gui = new dat.GUI();
        gui.add(GUIcontrols,'volume',0.0,1.0).step(0.1);
        gui.add(GUIcontrols, 'difficulty', {Low: 1, Mid: 2, Extreme: 3});
        gui.add(GUIcontrols, 'start');


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

function onKeyPress(event) {
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
        case " ":
          scene.robotJump();
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
  renderer.setClearColor(new THREE.Color(0x000000), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;  
}

/// It renders every frame
function render() {
  if(!rend)
    return;
  requestAnimationFrame(render);
  
  stats.update();
  scene.getCameraControls().update ();
  scene.animate(GUIcontrols);
  scene.updatePhysics();
  //cannonDebugRenderer.update();      Uncomment to display phyisics
    TWEEN.update();

    var views = scene.getActualView();
    for(var i = 0; i<views.length;i++){
      var view = views[i];

       var windowWidth  = window.innerWidth;
       var windowHeight = window.innerHeight;


        var left   = Math.floor( windowWidth  * view.left );
        var top    = Math.floor( windowHeight * view.top );
        var width  = Math.floor( windowWidth  * view.width );
        var height = Math.floor( windowHeight * view.height );

        renderer.setViewport( left, top, width, height );
        renderer.setScissor( left, top, width, height );
        renderer.setScissorTest( true );

        view.camera.aspect = width / height;
        view.camera.updateProjectionMatrix();

        renderer.render(scene, view.camera);

    }
}


function restart(){
    scene.reset();
}

/// The main function
$(function () {


    renderer = createRenderer();
    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);

    // liseners
    //window.addEventListener ("resize", onWindowResize);
    window.addEventListener ("keypress", onKeyPress, true);

    createGUI(true);

    scene = new TheScene (renderer.domElement);
    cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, scene.world );
    render();

});
