// Copyright (c) 2023 Niantic Labs.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)
//
// This file contains the indices for hand mesh usd by Mob
// https://github.com/SeanChenxy/HandMesh

#pragma once

#include "c8/geometry/mesh-types.h"
#include "c8/hpoint.h"
#include "c8/vector.h"

// Hand mesh model local path
static constexpr char HAND_MESH_MODEL_PATH[] = "reality/engine/hands/data/hand_mesh_v2.tflite";

// Arm mesh model local path
static constexpr char ARM_MESH_TEMPLATE_PATH[] = "reality/engine/hands/data/arm_template.glb";

// Hand mesh model key point number
// The hand mesh model needs to be paired with the correct number of key points.
// The first 21 (HAND_LANDMARK_DETECTIONS) points are the same as Mediapipe or MPII landmarks.
const int getHandMeshModelKeyPointCount();
void setHandMeshModelKeyPointCount(int numKeyPoints);

const int getWristMeshModelKeyPointCount();

// Hand mesh model output vertex number
constexpr int HANDMESH_R_VERTEX_COUNT = 778;
constexpr int HANDMESH_R_UV_VERTEX_COUNT = 886;
// Hand mesh triangle number
constexpr int HANDMESH_R_FACE_COUNT = 1538;

// This is a sample of right hand vertices
// https://github.com/SeanChenxy/HandMesh/tree/main/template/template.ply
extern const c8::Vector<c8::HPoint3> HANDMESH_R_SAMPLE_VERTICES;

// Right Hand mesh face mesh indices
extern const c8::Vector<c8::MeshIndices> HANDMESH_R_INDICES;

// Left Hand mesh face mesh indices
extern const c8::Vector<c8::MeshIndices> HANDMESH_L_INDICES;

// Computed using computeVertexNormals() from HANDMESH_R_SAMPLE_VERTICES & HANDMESH_R_INDICES
extern const c8::Vector<c8::HVector3> HANDMESH_R_SAMPLE_NORMALS;

// Per-vertex UVs for HANDMESH_R_UV_VERTEX_COUNT=886 vertices for right hand
extern const c8::Vector<c8::HPoint2> HANDMESH_R_UVS;

// Per-vertex UVs for HANDMESH_R_UV_VERTEX_COUNT=886 vertices for left hand
extern const c8::Vector<c8::HPoint2> HANDMESH_L_UVS;

// From 778 to 886 points to map to original 0-777 points
extern const c8::Vector<int> EXTENSION_VERTEX_MAP;

// Face vertex indices with the HANDMESH_R_UV_VERTEX_COUNT=886 UV vertices for right hand mesh
extern const c8::Vector<c8::MeshIndices> HANDMESH_R_VERT_UV_INDICES;

// Face vertex indices with the HANDMESH_R_UV_VERTEX_COUNT=886 UV vertices for left hand mesh
extern const c8::Vector<c8::MeshIndices> HANDMESH_L_VERT_UV_INDICES;

// This is used to compute landmark 3D positions based on the set of vertices.
// The vertex indices can be inspected in 3D apps such as Blender.
//
// The vertex indices for finger tips are the same as on line 18 of this file -
// https://github.com/CalciferZh/minimal-hand/blob/master/kinematics.py
extern const c8::Vector<c8::Vector<int> > HAND_R_MESH_LANDMARK_INDICES;

// https://github.com/CalciferZh/minimal-hand/blob/master/kinematics.py
// Mapping from MPII joint indices to MANO joint indices.
// The MPII labels on line 34 should match the MANO labels on line 7 after the mapping.
// Notice that the 3D joints computed by (j_reg * vertices) data are with MANO indices,
// while the 2D landmarks data are with MPII indices.
extern const c8::Vector<size_t> HAND_R_MESH_MPII_TO_MANO_MAP;

// This is used to compute attachment points for elliptic cylinders
// For example, for wrist cylinder, the bottom ellipse shape is defined by
//   HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HANDLANDMARK_WRIST],
// and the top ellipse shape is defined by
//   HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES[2 * HANDLANDMARK_WRIST + 1]
extern const c8::Vector<c8::Vector<int> > HAND_R_MESH_ATTACHMENT_CYLINDER_INDICES;

// Palm edge vertex index for palm radius calculation
constexpr int HANDMESH_R_VERTEX_INDEX_PALM_EDGE = 100;

// This is used to compute attachment points for knuckles
extern const c8::Vector<int> HAND_R_MESH_ATTACHMENT_KNUCKLE_INDICES;

// Use the vertex normals for each attachment point
extern const c8::Vector<int> HAND_R_MESH_NORMAL_INDICES;

// Vertex indices for attachment point rotation {v_up, v_down, v_left, v_right}
// see https://docs.google.com/document/d/<REMOVED_BEFORE_OPEN_SOURCING>
// see 'fit' functions in hand-mesh-research/src/assets/assets.py
extern const c8::Vector<c8::Vector<int> > HAND_R_MESH_ORIENTATION_INDICES;

constexpr int WRIST_MESH_ATTACHMENT_TOP = 46;     // top of wrist
constexpr int WRIST_MESH_ATTACHMENT_BOTTOM = 37;  // bottom of wrist
constexpr int WRIST_MESH_ATTACHMENT_INNER = 35;   // inner of wrist
constexpr int WRIST_MESH_ATTACHMENT_OUTER = 32;   // outer of wrist

// https://github.com/SeanChenxy/HandMesh/blob/main/template/j_reg.npy
// This is a [25 x 778] float matrix used to compute 3D joint points
// for either 21 key points or 25 key points.
extern const float HAND_R_MESH_J_REGRESSOR[];

// Arm mesh model output vertex number
constexpr int ARMMESH_VERTEX_COUNT = 80;
// Arm mesh triangle number
constexpr int ARMMESH_FACE_COUNT = 128;

// Vertex indices for arm attachment, found in reality/engine/hands/data/arm_keypoint_indices.json
extern const c8::Vector<int> ARM_KEYPOINT_INDICES;

// Arm vertices from the glb mesh.
extern const c8::Vector<c8::HPoint3> ARMMESH_VERTICES;

// Arm triangle indices from the glb mesh.
extern const c8::Vector<c8::MeshIndices> ARMMESH_INDICES;

// Arm normals from the glb mesh.
extern const c8::Vector<c8::HVector3> ARMMESH_NORMALS;

// Arm uvs from the glb mesh.
extern const c8::Vector<c8::HPoint2> ARMMESH_UVS;
