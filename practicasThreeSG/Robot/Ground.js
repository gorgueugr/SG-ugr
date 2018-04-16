//Based on:
/**
 * @author FVelasco
 * 
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */
//Modified by:
/**
 * @author Jorge Soler
 *
 * @param aWidth - The width of the ground
 * @param aDeep - The deep of the ground
 * @param aMaterial - The material of the ground
 * @param aBoxSize - The size for the boxes
 */

class Ground extends PhysicObject {

  constructor (aWidth, aDeep, aMaterial) {
    super();

    this.width = aWidth;
    this.deep = aDeep;
    this.material = aMaterial;

    this.ground = null;

    //Physics:
      this.shape = new CANNON.Box(new CANNON.Vec3(this.width/4,2,this.deep/6));

      this.ground = new PhysicMesh(
      new THREE.BoxGeometry (this.width/2, 2, this.deep/3, 1, 1, 1),
      this.material,
      this.shape,
          0
    );
      this.body = new CANNON.Body({mass:0});
      this.body.addShape(this.ground.shape);

    //__

    this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,1,0));
    this.ground.castShadow = true;
    this.ground.receiveShadow = true;

    this.ground.autoUpdateMatrix = false;
    this.add (this.ground);


    this.position.y = -2;


  }

}
