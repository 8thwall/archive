class ThreejsHandRenderer {
  constructor(handKind, scene) {
    this.handKind_ = handKind
    this.makeMirror_ = false

    this.handGroupName_ = 'hand-group'
    this.skinMaterial_ = new THREE.MeshLambertMaterial( { color: 0x666666 } )


    this.thumbCmcRatio_ = 1.5


    // debug
    this.modelPointGroup = null

debugger

    //var _this = this
    //const jointScale = 0.05
    
    const sphereGeom = new THREE.SphereGeometry(1, 16, 8);
    const cylinderGeom = new THREE.CylinderGeometry( 1, 1, 1, 32 )

    //create a group and add the two cubes
    //These cubes can now be rotated / scaled etc as a group
    const group = new THREE.Group();
    group.name = this.handGroupName_

    // palm
    const cpsGeom = new THREE.CapsuleGeometry( 1, 1, 4, 8 )
    this.palm_ = new THREE.Mesh( cpsGeom, this.skinMaterial_ )
    group.add(this.palm_)

    // thumb
    this.thumbCmc_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    group.add(this.thumbCmc_)
    this.thumbMcp_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.thumbIp_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.thumbTip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );

    this.thumbMcp2Ip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.thumbIp2Tip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );


    // index finger
    this.indexMcp_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.indexPip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.indexDip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.indexTip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );

    this.indexMcp2Pip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.indexPip2Dip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.indexDip2Tip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );

    // middle finger
    this.midMcp_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    group.add(this.midMcp_)
    this.midPip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    group.add(this.midPip_)
    this.midDip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    group.add(this.midDip_)
    this.midTip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    group.add(this.midTip_)

    this.midMcp2Pip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    group.add(this.midMcp2Pip_)
    this.midPip2Dip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    group.add(this.midPip2Dip_)
    this.midDip2Tip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    group.add(this.midDip2Tip_)

    // ring finger
    this.ringMcp_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.ringPip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.ringDip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.ringTip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );

    this.ringMcp2Pip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.ringPip2Dip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.ringDip2Tip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );

    // pinky
    this.pinkyMcp_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.pinkyPip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.pinkyDip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );
    this.pinkyTip_ = new THREE.Mesh( sphereGeom, this.skinMaterial_ );

    this.pinkyMcp2Pip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.pinkyPip2Dip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );
    this.pinkyDip2Tip_ = new THREE.Mesh( cylinderGeom, this.skinMaterial_ );

    // TODO - why below does not work?
    //this.handModel_.add(this.indexFinger_)
    //this.handModel_.visible = true
    //scene.add(this.handModel_)

    if (scene !== undefined) {
      scene.add(group)
      //scene.add(this.indexFinger_)
      //this.handModel_.visible = true//false
    }
  }

  show() {
    if (this.handModel_ != undefined) {
      this.handModel_.visible = true
    }
  }
  hide() {
    if (this.handModel_ != undefined) {
      this.handModel_.visible = false
    }
  }

  getBonePosition(boneIndex) {
    var bPos = new THREE.Vector3()
    //this.bones_[boneIndex].getWorldPosition(bPos)
    return bPos
  }

  poseJoint(group, jointMesh, pos, radius) {
    jointMesh.position.set(pos.x, pos.y, pos.z)
    jointMesh.scale.set(radius, radius, radius)
    group.add(jointMesh)
  }

  poseBone(group, boneMesh, bPos0, bPos1, radius) {
    const center = new THREE.Vector3().addVectors(bPos0, bPos1)
    center.multiplyScalar(0.5)
    boneMesh.position.copy(center)
    center.subVectors(bPos1, bPos0)
    boneMesh.scale.set(radius, center.length(),  radius)
    center.normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), center)
    boneMesh.quaternion.copy(q)
    group.add(boneMesh)
  }

  posePalmCapsule(group, pos0, pos1, refPos, thickness) {
    const centerAxis = new THREE.Line3(pos0, pos1)
    const centerVec = new THREE.Vector3().subVectors(pos1, pos0)
    const height = centerVec.length()

    const geometry = new THREE.CapsuleGeometry( thickness, height, 4, 8 );
    const capsule = new THREE.Mesh( geometry, this.skinMaterial_ );

    const center = new THREE.Vector3()
    centerAxis.getCenter(center)
    capsule.position.copy(center)

//debugger
    centerVec.normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), centerVec)
    capsule.quaternion.copy(q)
    const vx = new THREE.Vector3(1, 0, 0)
    vx.applyQuaternion(q)

    const projP = new THREE.Vector3()
    centerAxis.closestPointToPoint( refPos, false, projP )

    //
    const refV = new THREE.Vector3().subVectors(refPos, projP)
    refV.normalize()
    const angle = vx.angleTo(refV)
    capsule.rotateOnAxis ( centerVec, -angle )

    capsule.scale.set(4, 1, 1)

    group.add(capsule)
  }

  poseThumbCmc2Mcp(group, cmcPos, mcpPos, cmcRatio, knkRadius) {
    const cmcMcpLine = new THREE.Line3(cmcPos, mcpPos)
    const cmcMcpGeom = new THREE.CylinderGeometry( knkRadius, cmcRatio * knkRadius, cmcMcpLine.distance(), 32)
    const cmcMcp = new THREE.Mesh( cmcMcpGeom, this.skinMaterial_ )
    const c = new THREE.Vector3()
    cmcMcpLine.getCenter(c)
    cmcMcp.position.copy(c)

    const vec = new THREE.Vector3().subVectors(mcpPos, cmcPos)
    vec.normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec)
    cmcMcp.quaternion.copy(q)
 
    group.add(cmcMcp)
  }

  // extrude triangle (v0,v1,v2) with height to generate a triangle slab
  poseTriangleSlab(group, v0, v1, v2, height) {

  }

  poseHandBy21Verts(group, vertices, normals) {
//debugger
    const knuckleVec = new THREE.Vector3().subVectors(vertices[9], vertices[5])
    const knuckleRadius = knuckleVec.length() / 2

    // palm
    //this.poseTriangleSlab(group, vertices[0], vertices[5], vertices[9], knuckleRadius)
    this.posePalmCapsule(group, vertices[0], vertices[9], vertices[5], knuckleRadius)

    // thumb
    this.poseJoint(group, this.thumbCmc_, vertices[1], this.thumbCmcRatio_ * knuckleRadius)
    this.poseJoint(group, this.thumbMcp_, vertices[2], knuckleRadius)
    this.poseJoint(group, this.thumbIp_, vertices[3], knuckleRadius)
    this.poseJoint(group, this.thumbTip_, vertices[4], knuckleRadius)

    this.poseThumbCmc2Mcp(group, vertices[1], vertices[2], this.thumbCmcRatio_, knuckleRadius)
    this.poseBone(group, this.thumbMcp2Ip_, vertices[2], vertices[3], knuckleRadius)
    this.poseBone(group, this.thumbIp2Tip_, vertices[3], vertices[4], knuckleRadius)

    // index finger
    //this.indexMcp_.position.set(vertices[5].x, vertices[5].y, vertices[5].z)
    //this.indexMcp_.scale.set(knuckleRadius, knuckleRadius, knuckleRadius)
    //group.add(this.indexMcp_)
    this.poseJoint(group, this.indexMcp_, vertices[5], knuckleRadius)
    this.poseJoint(group, this.indexPip_, vertices[6], knuckleRadius)
    this.poseJoint(group, this.indexDip_, vertices[7], knuckleRadius)
    this.poseJoint(group, this.indexTip_, vertices[8], knuckleRadius)

    //this.indexMcp2Pip_.position.set(0, 0, 0)
    //this.indexMcp2Pip_.scale.set(jointScale, 1,  jointScale)
    //group.add(this.indexMcp2Pip_)
    this.poseBone(group, this.indexMcp2Pip_, vertices[5], vertices[6], knuckleRadius)
    this.poseBone(group, this.indexPip2Dip_, vertices[6], vertices[7], knuckleRadius)
    this.poseBone(group, this.indexDip2Tip_, vertices[7], vertices[8], knuckleRadius)

    // middle finger
    this.poseJoint(group, this.midMcp_, vertices[9], knuckleRadius)
    this.poseJoint(group, this.midPip_, vertices[10], knuckleRadius)
    this.poseJoint(group, this.midDip_, vertices[11], knuckleRadius)
    this.poseJoint(group, this.midTip_, vertices[12], knuckleRadius)

    this.poseBone(group, this.midMcp2Pip_, vertices[9], vertices[10], knuckleRadius)
    this.poseBone(group, this.midPip2Dip_, vertices[10], vertices[11], knuckleRadius)
    this.poseBone(group, this.midDip2Tip_, vertices[11], vertices[12], knuckleRadius)

    // ring finger
    this.poseJoint(group, this.ringMcp_, vertices[13], knuckleRadius)
    this.poseJoint(group, this.ringPip_, vertices[14], knuckleRadius)
    this.poseJoint(group, this.ringDip_, vertices[15], knuckleRadius)
    this.poseJoint(group, this.ringTip_, vertices[16], knuckleRadius)

    this.poseBone(group, this.ringMcp2Pip_, vertices[13], vertices[14], knuckleRadius)
    this.poseBone(group, this.ringPip2Dip_, vertices[14], vertices[15], knuckleRadius)
    this.poseBone(group, this.ringDip2Tip_, vertices[15], vertices[16], knuckleRadius)

    // pinky
    this.poseJoint(group, this.pinkyMcp_, vertices[17], knuckleRadius)
    this.poseJoint(group, this.pinkyPip_, vertices[18], knuckleRadius)
    this.poseJoint(group, this.pinkyDip_, vertices[19], knuckleRadius)
    this.poseJoint(group, this.pinkyTip_, vertices[20], knuckleRadius)

    this.poseBone(group, this.pinkyMcp2Pip_, vertices[17], vertices[18], knuckleRadius)
    this.poseBone(group, this.pinkyPip2Dip_, vertices[18], vertices[19], knuckleRadius)
    this.poseBone(group, this.pinkyDip2Tip_, vertices[19], vertices[20], knuckleRadius)

  }

  poseHand(scene, position, rotation, scale, vertices, normals) {
    if (scene == undefined || vertices == undefined || normals == undefined) {
      return
    }

    //this.handModel_.position.set(position.x, position.y, position.z)
    //this.handModel_.setRotationFromQuaternion(rotation)
    //this.handModel_.scale.set(scale, scale, scale)
    if (vertices.length == 21) {
      const vdx = vertices[9].x - vertices[0].x
      const vdy = vertices[9].y - vertices[0].y
      const vdz = vertices[9].z - vertices[0].z
      const vr = Math.sqrt(vdx*vdx + vdy*vdy + vdz*vdz)

//debugger
      //const modelScale = 1//1.3//vr * scale / this.originPalmLength_ * 0.62 //
      //this.model_.scale.set(modelScale, modelScale, modelScale)
      //this.handModel_.scale.set(scale, scale, scale)

      const oldGroup = scene.getObjectByName(this.handGroupName_)
      scene.remove(oldGroup)

      const group = new THREE.Group()
      this.poseHandBy21Verts(group, vertices, normals)
      group.position.set(position.x, position.y, position.z)
      //group.setRotationFromQuaternion(rotation)
      group.scale.set(scale, scale, scale)
      scene.add(group)
    }
  }
}

// 👇️ named export (same as previous code snippet)
export {ThreejsHandRenderer};
