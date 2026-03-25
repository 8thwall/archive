class ThreejsHand21 {
  constructor(handKind, modelPath, scene) {
    // model path
    //const leftModelPath = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0.10/dist/profiles/generic-hand/left.glb'
    //const leftModelPath = './left_rig.glb'
    //const rightModelPath = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0.10/dist/profiles/generic-hand/right.glb'
    //const rightModelPath = './right_rig.glb'
    this.handKind_ = handKind
    this.modelPath_ = modelPath
    this.model_ = null
    this.handModel_ = null

    this.handMeshNodeName_ = "Armature"


    this.debug = true

    this.scene_ = new THREE.Scene();


    this.originBones_ = []
    this.originBonePos_ = []
    this.bones_ = []
    this.originPalmLength_ = 0

    this.aa = 0

    this.pMidMcp_ = new THREE.Vector3( 0, 0, 0 )
    this.makeMirror_ = true


/*
    this.pWrist_ = new THREE.Vector3( 0, 0, 0 )
    this.pIndMcp_ = new THREE.Vector3( 0, 0, 0 )
    this.vMid2Wrist_ = new THREE.Vector3( 0, 0, 0 )
    this.vMid2Index_ = new THREE.Vector3( 0, 0, 0 )
    this.transformedVerts_ = []
    this.fingerBaseVects_ = []
    this.scaleFactor_ = (handKind==1)? 0.65 : 0.64

    this.v_ = []

    this.originJointQ_ = []

    this.originJointVectors_ = [] // index is using the base joint index. if 10, the vector is 10->11.

    this.currentJointVectors_ = []
    this.currentJointQ_ = []

    // length between (i-1)~(i); except 1,5,10,15,20 are length from bone to wrist
    this.originBoneLengths_ = []


    this.b1R_ = null
    this.b1Q_ = null
    
    this.modelPointGroup = null  //debug

    this.middleFingerY = 0.262 //15degree
*/

    // joint names
    const jointNames = [
      'wrist',//0
      'thumb-metacarpal',//1
      'thumb-phalanx-proximal',//2
      'thumb-phalanx-distal',//3
      'thumb-tip',//4
      'index-finger-metacarpal',//5
      'index-finger-phalanx-proximal',//6
      'index-finger-phalanx-intermediate',//7
      'index-finger-phalanx-distal',//8
      'index-finger-tip',//9
      'middle-finger-metacarpal',//10
      'middle-finger-phalanx-proximal',//11
      'middle-finger-phalanx-intermediate',//12
      'middle-finger-phalanx-distal',//13
      'middle-finger-tip',//14
      'ring-finger-metacarpal',//15
      'ring-finger-phalanx-proximal',//16
      'ring-finger-phalanx-intermediate',//17
      'ring-finger-phalanx-distal',//18
      'ring-finger-tip',//19
      'pinky-finger-metacarpal',//20
      'pinky-finger-phalanx-proximal',//21
      'pinky-finger-phalanx-intermediate',//22
      'pinky-finger-phalanx-distal',//23
      'pinky-finger-tip',//24
    ]

    var _this = this
    const loader = new THREE.GLTFLoader();
    loader.load(this.modelPath_, function ( gltf ) {
      _this.handModel_ = gltf.scene.getObjectByName(_this.handMeshNodeName_)

      jointNames.forEach( jointName => {
        const bone = _this.handModel_.getObjectByName( jointName );
        if ( bone !== undefined ) {
          bone.jointName = jointName;
        } else {
          console.warn( `Couldn't find ${jointName} in hand mesh` );
        }

        if (bone) {
          _this.bones_.push( bone )
          _this.originBones_.push( bone.clone() )
          //console.log(jointName, bone.rotation.x, bone.rotation.y, bone.rotation.z)
          var tgt = new THREE.Vector3()
          bone.getWorldPosition( tgt )
          _this.originBonePos_.push(tgt)
        } else {
          _this.bones_.push( new THREE.Bone() )
          _this.originBones_.push( new THREE.Bone() )
          _this.originBonePos_.push(new THREE.Vector3())
        }
      });

      var target = new THREE.Vector3()
      _this.bones_[11].getWorldPosition( target )
      _this.pMidMcp_.copy(target)

/*
      //
      // make the middle finger mcp as the origin
       // create once an reuse it
      _this.bones_[0].getWorldPosition( target )
      _this.pWrist_.copy(target)
      _this.bones_[6].getWorldPosition( target )
      _this.pIndMcp_.copy(target)
      

      _this.vMid2Wrist_.copy(_this.pWrist_)
      _this.vMid2Wrist_.sub(_this.pMidMcp_)
      _this.vMid2Wrist_.normalize()
      _this.vMid2Index_.copy(_this.pIndMcp_)
      _this.vMid2Index_.sub(_this.pMidMcp_)
      _this.vMid2Index_.normalize()

      const dP = new THREE.Vector3(_this.originBonePos_[11].x - _this.originBonePos_[10].x,
        _this.originBonePos_[11].y - _this.originBonePos_[10].y,
        _this.originBonePos_[11].z - _this.originBonePos_[10].z)
      _this.originPalmLength_ = dP.length()

      _this.fingerBaseVects_ = []
      const thumbV = new THREE.Vector3().subVectors(_this.originBonePos_[2], _this.originBonePos_[1])
      thumbV.normalize()
      _this.fingerBaseVects_.push(thumbV)
      const indexV = new THREE.Vector3().subVectors(_this.originBonePos_[7], _this.originBonePos_[6])
      indexV.normalize()
      _this.fingerBaseVects_.push(indexV)
      const middleV = new THREE.Vector3().subVectors(_this.originBonePos_[12], _this.originBonePos_[11])
      middleV.normalize()
      _this.fingerBaseVects_.push(middleV)
      const ringV = new THREE.Vector3().subVectors(_this.originBonePos_[17], _this.originBonePos_[16])
      ringV.normalize()
      _this.fingerBaseVects_.push(ringV)
      const pinkyV = new THREE.Vector3().subVectors(_this.originBonePos_[22], _this.originBonePos_[21])
      pinkyV.normalize()
      _this.fingerBaseVects_.push(pinkyV)
*/

      _this.model_ = new THREE.Group()
      _this.model_.name = 'hand_group'
      _this.model_.quaternion.identity()
      _this.model_.updateMatrixWorld()
      _this.handModel_.quaternion.identity()
      _this.handModel_.position.x = -_this.pMidMcp_.x
      _this.handModel_.position.y = -_this.pMidMcp_.y
      _this.handModel_.position.z = -_this.pMidMcp_.z
      _this.model_.add(_this.handModel_)

      _this.model_.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI)

      if (scene !== undefined) {
        scene.add(_this.model_)
        _this.model_.visible = false
      }

/*
      //debug
      // visualize detection points as spheres
      _this.modelPointGroup = new THREE.Group();
      _this.modelPointGroup.name = 'debug_model_point_group'
      _this.modelPointGroup.quaternion.w = 1
      const spMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
      _this.originBonePos_.forEach( pt => {
        //debugger
        const geometry = new THREE.SphereGeometry( 0.002, 16, 8 );
        const sphere = new THREE.Mesh( geometry, spMaterial );
        //sphere.position.x = pt.x
        //sphere.position.y = pt.y
        //sphere.position.z = pt.z
        const np = new THREE.Vector3(pt.x, pt.y, pt.z)
        //np.applyMatrix4(M)
        sphere.position.copy(np)
        //scene.add( sphere );
        _this.modelPointGroup.add( sphere )
      })
      //_this.handModel_.visible = false
      if (scene !== undefined) {
        scene.add(_this.modelPointGroup)
      }
*/

    })
  }

  show() {
    if (this.model_ != undefined) {
      this.model_.visible = true
    }
  }
  hide() {
    if (this.model_ != undefined) {
      this.model_.visible = false
    }
  }

  /*
  // original
  boneLookAtLocal(bone, position) {
//debugger
    bone.updateMatrixWorld()
    let direction = position.clone().normalize()
    let pitch = Math.asin(-direction.y)// + bone.offset
    let yaw = Math.atan2(direction.x, direction.z); //Beware cos(pitch)==0, catch this exception!
    let roll = Math.PI;
    //bone.rotation.set(roll, yaw, pitch);
    bone.rotation.set(roll, 0, Math.PI/4);
  }
  // original
  boneLookAtWorld(bone, dir) {
//debugger
    const parent = bone.parent;

    this.scene_.attach(bone)
    //this.scene_.add(bone)

    this.boneLookAtLocal(bone, dir)

    parent.attach(bone)
  }
  */

  boneLookAtWorld(bone, dir) {
    const parent = bone.parent
    //bone.removeFromParent()
    parent.remove(bone)
    const v0 = new THREE.Vector3(0, 0, -1)
    const v = dir.clone()
    v.normalize()
    const quat = new THREE.Quaternion().setFromUnitVectors(v0, v)
    //quat.z = 0//-quat.z
    //bone.quaternion.copy(quat)

    const rot = new THREE.Euler().setFromQuaternion(quat)
    bone.rotation.x=rot.x;
    bone.rotation.y=rot.y;
    //bone.rotation.z=rot.z;  // somehow remove this factor resolve the joint twisting problem

    parent.attach(bone)
  }

  // bring these 3 points on to the same plane,
  // center at pTo point,
  // and align pFrom-pTo vector to THREE.Vector3(0, -1, 0)
  // Used to compute the finger local rotations
  getPoseMatrixToModelSpace(pFrom, pTo, pPlane, planeName) {
//debugger
    // center to pTo point
    const tMat4 = new THREE.Matrix4().makeTranslation(-pTo.x, -pTo.y, -pTo.z)
    // rotate to align pFrom-pTo vector to THREE.Vector3(0, -1, 0)
    const basev = new THREE.Vector3().subVectors(pTo, pFrom)
    basev.normalize()
    var quat = new THREE.Quaternion()
    quat.setFromUnitVectors( basev, new THREE.Vector3(0, -1, 0))
    const rMat4 = new THREE.Matrix4().makeRotationFromQuaternion(quat)

    if (planeName == 'Z') {
      const refv = new THREE.Vector3().subVectors(pPlane, pFrom)
      refv.applyMatrix4(rMat4)
      refv.y = 0
      refv.normalize()
      const alignVec = new THREE.Vector3(1, 0, 0)
      if (this.handKind_ == 2) {
        alignVec.x = -1
      }
      const ag = refv.angleTo(alignVec)
      var dirSign = 1
      if ((this.handKind_ == 1 && refv.z < 0)
        || (this.handKind_ == 2 && refv.z > 0)) {
        dirSign = -1
      }
      //console.log(ag * 180 / Math.PI)
      const rotM2 = new THREE.Matrix4().makeRotationY(dirSign * ag)
      //return rotM2.multiply(rMat4.multiply(tMat4))
      const adjustM = new THREE.Matrix4()//.makeRotationZ(this.middleFingerY)
      return adjustM.multiply(rotM2.multiply(rMat4.multiply(tMat4)))
    }
    if (planeName == 'X') {
      return rMat4.multiply(tMat4)
    }

    return rMat4.multiply(tMat4)

    //const adjustRad = Math.PI / 5
    //const adjustM = new THREE.Matrix4()
    //if (this.handKind_ == 1) {
    //  adjustM.makeRotationZ(adjustRad)
    //} else {
    //  adjustM.makeRotationZ(-adjustRad)
    //}
    //return adjustM.multiply(rotM2.multiply(rMat4.multiply(tMat4)))
  }

  getEulerByTwoVectors(srcVec, targetVec) {
    // Normalize vectors to make sure they have a length of 1
    srcVec.normalize();
    targetVec.normalize();
    // Create a quaternion, and apply starting, then ending vectors
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(srcVec, targetVec);

    // Quaternion now has rotation data within it.
    // We'll need to get it out with a THREE.Euler()
    var euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);
    //console.log(euler.toArray())
    return euler
  }

  // compute bone joint rotation directly
  poseBoneBy21VertsNoTransform(vertices, refIndex, baseIndex, toIndex, boneIndex) {
    const v1 = new THREE.Vector3()
    if (refIndex < 0) {
      const vInd = -refIndex - 1
      if (false && vInd >= 1) {
        v1.copy(this.fingerBaseVects_[vInd])
      } else {
        v1.y = -1
      }
    } else {
      v1.subVectors(vertices[baseIndex], vertices[refIndex])
    }
    v1.normalize()
    const v2 = new THREE.Vector3().subVectors(vertices[toIndex], vertices[baseIndex])
    v2.normalize()

    const euler = this.getEulerByTwoVectors(v1, v2)
    //this.bones_[boneIndex].rotation.copy(euler)

    // debug
    const ang = v1.angleTo(v2)
    //this.bones_[boneIndex].rotation.set(0, 0, 0)
    this.bones_[boneIndex].setRotationFromAxisAngle(new THREE.Vector3(-1, 0, 0), ang)
  }

  poseTransformedFingers(transformM, vertices) {
//debugger
    this.transformedVerts_ = []
    vertices.forEach( vert => {
      const v = new THREE.Vector3(vert.x, vert.y, vert.z)
      v.applyMatrix4(transformM)
      this.transformedVerts_.push(v)
    });

    const offset = this.transformedVerts_[9].clone()
    this.transformedVerts_.forEach( vert => {
      vert.x -= offset.x
      vert.y -= offset.y
      vert.z -= offset.z
    });

    //this.handModel_.removeFromParent()
    const modelParent = this.handModel_.parent
    modelParent.remove(this.handModel_)

    const diffP = new THREE.Vector3()

  // thumb
  this.bones_[1].position.copy(this.transformedVerts_[1])
  diffP.subVectors(this.transformedVerts_[2], this.transformedVerts_[1])
  this.boneLookAtWorld(this.bones_[1], diffP)
  this.bones_[2].position.copy(this.transformedVerts_[2])
  diffP.subVectors(this.transformedVerts_[3], this.transformedVerts_[2])
  this.boneLookAtWorld(this.bones_[2], diffP)
  this.bones_[3].position.copy(this.transformedVerts_[3])
  diffP.subVectors(this.transformedVerts_[4], this.transformedVerts_[3])
  this.boneLookAtWorld(this.bones_[3], diffP)
  this.bones_[4].position.copy(this.transformedVerts_[4])
  this.boneLookAtWorld(this.bones_[4], diffP)

  // index
  // TODO: move bone5?
  this.bones_[6].position.copy(this.transformedVerts_[5])
  diffP.subVectors(this.transformedVerts_[6], this.transformedVerts_[5])
  this.boneLookAtWorld(this.bones_[6], diffP)

  this.bones_[7].position.copy(this.transformedVerts_[6])
  diffP.subVectors(this.transformedVerts_[7], this.transformedVerts_[6])
  this.boneLookAtWorld(this.bones_[7], diffP)

  this.bones_[8].position.copy(this.transformedVerts_[7])
  diffP.subVectors(this.transformedVerts_[8], this.transformedVerts_[7])
  this.boneLookAtWorld(this.bones_[8], diffP)

  this.bones_[9].position.copy(this.transformedVerts_[8])
  this.boneLookAtWorld(this.bones_[9], diffP)

  // middle
  this.bones_[11].position.copy(this.transformedVerts_[9])
  diffP.subVectors(this.transformedVerts_[10], this.transformedVerts_[9])
  this.boneLookAtWorld(this.bones_[11], diffP)

  this.bones_[12].position.copy(this.transformedVerts_[10])
  diffP.subVectors(this.transformedVerts_[11], this.transformedVerts_[10])
  this.boneLookAtWorld(this.bones_[12], diffP)

  this.bones_[13].position.copy(this.transformedVerts_[11])
  diffP.subVectors(this.transformedVerts_[12], this.transformedVerts_[11])
  this.boneLookAtWorld(this.bones_[13], diffP)

  this.bones_[14].position.copy(this.transformedVerts_[12])
  this.boneLookAtWorld(this.bones_[14], diffP)

  // ring
  this.bones_[16].position.copy(this.transformedVerts_[13])
  diffP.subVectors(this.transformedVerts_[14], this.transformedVerts_[13])
  this.boneLookAtWorld(this.bones_[16], diffP)

  this.bones_[17].position.copy(this.transformedVerts_[14])
  diffP.subVectors(this.transformedVerts_[15], this.transformedVerts_[14])
  this.boneLookAtWorld(this.bones_[17], diffP)

  this.bones_[18].position.copy(this.transformedVerts_[15])
  diffP.subVectors(this.transformedVerts_[16], this.transformedVerts_[15])
  this.boneLookAtWorld(this.bones_[18], diffP)

  this.bones_[19].position.copy(this.transformedVerts_[16])
  this.boneLookAtWorld(this.bones_[19], diffP)

  // pinky
  this.bones_[21].position.copy(this.transformedVerts_[17])
  diffP.subVectors(this.transformedVerts_[18], this.transformedVerts_[17])
  this.boneLookAtWorld(this.bones_[21], diffP)

  this.bones_[22].position.copy(this.transformedVerts_[18])
  diffP.subVectors(this.transformedVerts_[19], this.transformedVerts_[18])
  this.boneLookAtWorld(this.bones_[22], diffP)

  this.bones_[23].position.copy(this.transformedVerts_[19])
  diffP.subVectors(this.transformedVerts_[20], this.transformedVerts_[19])
  this.boneLookAtWorld(this.bones_[23], diffP)

  this.bones_[24].position.copy(this.transformedVerts_[20])
  this.boneLookAtWorld(this.bones_[24], diffP)


  //this.model_.add(this.handModel_)
  modelParent.add(this.handModel_)
return
    // transform even further to almost align with the model pose
    //const curPalmV = new THREE.Vector3().subVectors(this.transformedVerts_[5], this.transformedVerts_[9])
    //const modelPalmV = new THREE.Vector3().subVectors(this.originBonePos_[6], this.originBonePos_[11])
    const curPalmV = new THREE.Vector3().subVectors(this.transformedVerts_[9], this.transformedVerts_[0])
    const modelPalmV = new THREE.Vector3().subVectors(this.originBonePos_[11], this.originBonePos_[0])
    const sclF = 0.0733//modelPalmV.length() / curPalmV.length()
    const transM = new THREE.Matrix4().makeTranslation(0, -this.transformedVerts_[0].y, 0)
    const sclM = new THREE.Matrix4().makeScale ( sclF, sclF, sclF )
    sclM.multiply(transM)
    this.transformedVerts_.forEach( vert => {
      vert.applyMatrix4(sclM)
    });

    // TODO - need a better model for posing palm bones

  }

  poseHandBy21Verts(vertices, normals) {
//debugger
    const poseM = this.getPoseMatrixToModelSpace(vertices[0], vertices[9], vertices[5], 'Z')
    const rotM = new THREE.Matrix4()
    rotM.extractRotation(poseM)

    const wristPt = new THREE.Vector3().copy(vertices[0])
    const midMcp = new THREE.Vector3().copy(vertices[9])

    wristPt.applyMatrix4(poseM)
    midMcp.applyMatrix4(poseM)

    const transM = new THREE.Matrix4().makeTranslation(0, -wristPt.y, 0)
    transM.multiply(poseM)
    const sclF = 0.0733
    const sclM = new THREE.Matrix4().makeScale ( sclF, sclF, sclF )
    sclM.multiply(transM)

    this.poseTransformedFingers(sclM, vertices)


    //rotM.invert()
    //const locEuler = new THREE.Euler().setFromRotationMatrix(rotM)
    //this.model_.rotation.copy(locEuler) // rotation matrix from data space to model space

    // rotation axis in data space, map to local model space rotation axis
    const rotAxis = new THREE.Vector3(0, 1, 0)
    rotAxis.applyMatrix4(rotM)

    rotM.invert()  // rotation matrix from model space to data space

    if (this.makeMirror_) {
      const mirrorM = new THREE.Matrix4().makeRotationAxis(rotAxis, Math.PI)
      rotM.multiply(mirrorM)
      //mirrorM.multiply(rotM)
      //const locEuler = new THREE.Euler().setFromRotationMatrix(mirrorM)
    }

//debugger
    //this.model_.translateX(-10*this.pMidMcp_.x)
    //this.model_.translateY(1.2*this.pMidMcp_.y)
    //this.model_.translateZ(10*this.pMidMcp_.z)

    const locEuler = new THREE.Euler().setFromRotationMatrix(rotM)

//    const vvv = new THREE.Vector3(this.transformedVerts_[9].x, this.transformedVerts_[9].y, this.transformedVerts_[9].z)
//    vvv.applyMatrix4(rotM)
    //const tm = new THREE.Matrix4().makeTranslation(vvv.x, vvv.y, vvv.z)
//    const tm = new THREE.Matrix4().makeTranslation(vvv.x, vvv.y, 0)
//this.model_.applyMatrix4(tm)

    this.model_.rotation.copy(locEuler)

  }

  poseHand(position, rotation, scale, vertices, normals) {
//debugger
    if (this.handModel_ == undefined || vertices == undefined || normals == undefined) {
      return
    }

    //this.model_.position.set(position.x, position.y, position.z)
    this.model_.position.set(position.x, position.y, position.z)
    this.model_.setRotationFromQuaternion(rotation)
    if (vertices.length == 21) {
      const vdx = vertices[9].x - vertices[0].x
      const vdy = vertices[9].y - vertices[0].y
      const vdz = vertices[9].z - vertices[0].z
      const vr = Math.sqrt(vdx*vdx + vdy*vdy + vdz*vdz)

//debugger
      const modelScale = 1.1//1.3//vr * scale / this.originPalmLength_ * 0.62 //
      this.model_.scale.set(modelScale, modelScale, modelScale)

      this.poseHandBy21Verts(vertices, normals)
    }
  }

  getBonePosition(boneIndex) {
    var bPos = new THREE.Vector3()
    this.bones_[boneIndex].getWorldPosition(bPos)
    return bPos
  }
}

// 👇️ named export (same as previous code snippet)
export {ThreejsHand21};
