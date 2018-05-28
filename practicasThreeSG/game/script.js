
/// Several functions, including the main

Physijs.scripts.worker = '../libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
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

function onkeyDown(event) {
    var keyCode = event.keyCode;
    //keyCode = keyCode.toLowerCase();
    //console.log("Key down" + keyCode);
    switch (keyCode) {
        case 38: // up
        case 87: // w
            scene.forward();
            break;

        case 40: // down
        case 83: // s
            scene.backward();
            break;

        case 37: // left
        case 65: // a
            scene.left();
            break;

        case 39: // right
        case 68: // d
            scene.right();
            break;
        case 67: //c
            scene.changeCamera();
            break;
        case 77: //m
            if(applicationMode == TheScene.SETTING_HIT)
                scene.ball.morePower();
            break;
        case 76: //l
            if(applicationMode == TheScene.SETTING_HIT)
                scene.ball.lessPower();
            break;
    }
}


function onkeyUp(event) {
    var keyCode = event.keyCode;
    //keyCode = keyCode.toLowerCase();
    //console.log(keyCode);
    //console.log("Key up" + keyCode);

    switch (keyCode) {
        case 32:
            scene.tirar();
            break;
        case 70: //f
            scene.prepareHit();
            //scene.hitAnimation();
            break;
        case 69: //e
            scene.player.stopAnimation();
            scene.player.animate("preHit");
            break;
        case 67:
            break;
        default:
            scene.stop();
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
    scene.simulate( undefined, 1 );
    scene.update();
    TWEEN.update();
    //scene.getCameraControls().update ();
    scene.animate(GUIcontrols);



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
    window.addEventListener ("keydown", onkeyDown, true);
    window.addEventListener ("keyup", onkeyUp, true);


    //Pointer

    var havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;


    //createGUI(true);
    stats = initStats();
    scene = new TheScene (renderer.domElement);
    scene.simulate( undefined, 1 );


    render();

});
