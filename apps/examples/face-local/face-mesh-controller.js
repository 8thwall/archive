//  Creates a face mesh.
const genMesh = (modelGeometry, texMap) => {
  const geometry = new THREE.Geometry()
  
  // fill the geometry with default vertices
  for (let index = 0; index < modelGeometry.pointsPerDetection; index++) {
    geometry.vertices.push(new THREE.Vector3())
  }

  // add the UVs to the geometry
  const uvs = []
  for (let index = 0; index < modelGeometry.uvs.length; ++index) {
    const uv = modelGeometry.uvs[index]
    uvs.push(new THREE.Vector2(uv.u, 1 - uv.v))
  }

  // add the indices to the geometry to connect the vertices
  const {indices} = modelGeometry
  for (let i = 0; i < indices.length; i += 1) {
    const idxs = indices[i]
    const f = new THREE.Face3(idxs.a, idxs.b, idxs.c)
    f.vertexNormals[0] = new THREE.Vector3()
    f.vertexNormals[1] = new THREE.Vector3()
    f.vertexNormals[2] = new THREE.Vector3()
    geometry.faces.push(f)
    geometry.faceVertexUvs[0].push([uvs[idxs.a], uvs[idxs.b], uvs[idxs.c]])
  }
  
  const material = new THREE.MeshStandardMaterial({map: texMap, transparent: true,  opacity: 0.75})

  return new THREE.Mesh(geometry, material)
}

const faceMeshController = (textureUrl) => {
  const texMap_ =  new THREE.TextureLoader().load(textureUrl)
  let modelGeometry_
  let headMesh_
  
  const hide = () => {
    headMesh_.visible = false
  }

  const buildMesh = (modelGeometry) => {
    modelGeometry_ = modelGeometry
    headMesh_ = genMesh(modelGeometry_, texMap_)
    
    headMesh_.position.set(0, 0, -0.5)
    headMesh_.setRotationFromQuaternion({w: 0, x: 0, y: 1, z: 0})
    headMesh_.scale.set(0.14, 0.14, 0.14)
    
    hide()
    return headMesh_
  }
  
  const update = ({vertices, normals, transform}) => {  // Keeps face mesh in sync with video feed.
    vertices.forEach((v, index)=> {  // Update the vertices
      headMesh_.geometry.vertices[index].x = v.x
      headMesh_.geometry.vertices[index].y = v.y
      headMesh_.geometry.vertices[index].z = v.z
    })
    headMesh_.geometry.verticesNeedUpdate = true
    
    headMesh_.geometry.faces.forEach((face) => {  // Update the normals.
		  face.vertexNormals[0].copy(normals[face.a])
		  face.vertexNormals[1].copy(normals[face.b])
		  face.vertexNormals[2].copy(normals[face.c])
    })
    headMesh_.geometry.normalsNeedUpdate = true
    
    headMesh_.visible = true
  }
 
  return {
    update,
    hide,
    buildMesh: (modelGeometry) => buildMesh(modelGeometry),
    mesh: () => headMesh_,
  }
}

export {faceMeshController}
