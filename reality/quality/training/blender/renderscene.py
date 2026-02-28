# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

import bpy
import math
import os

renderAnimation=True
outputPath = "/tmp"
outputFilePrefix = "blender_"
outputFileIncludeBlendFilename = True
resolutionX = 512
resolutionY = 512
fileFormat = 'PNG'
fileCompression = 90

nFileOutput = None

def addNode(nodeTree, name, xPos, yPos):
    node = nodeTree.nodes.new(name)
    node.location = (xPos,yPos)
    return node

def getLastKeyFrameInScene():

    highestKeyFrame = 1
    
    # Loop through each camera and render
    for obj in bpy.context.scene.objects:
        if obj.type == 'CAMERA':
            anim = obj.animation_data
            if anim is not None and anim.action is not None:
                for fcu in anim.action.fcurves:
                    for keyframe in fcu.keyframe_points:
                        x, y = keyframe.co
                        if x > highestKeyFrame:
                            highestKeyFrame = x

    return int(highestKeyFrame)

def getLastKeyFrameForCamera(obj):

    highestKeyFrame = 1
    
    # Loop through each camera and render
    if obj.type == 'CAMERA':
        anim = obj.animation_data
        if anim is not None and anim.action is not None:
            for fcu in anim.action.fcurves:
                for keyframe in fcu.keyframe_points:
                    x, y = keyframe.co
                    if x > highestKeyFrame:
                        highestKeyFrame = x

    return int(highestKeyFrame)

def deleteAllShaderNodes():
    for obj in bpy.context.scene.objects:
        if (obj.type == 'MESH') or (obj.type == 'CURVE'):
            print("DELETING Shader Nodes for MESH: " + obj.name)
            bpy.context.scene.objects.active = obj
            bpy.context.object.active_material.use_nodes = False

            nodeTree = bpy.context.object.active_material.node_tree
            nodeLinks = nodeTree.links

            # Clear default nodes if they exist
            for n in nodeTree.nodes:
                nodeTree.nodes.remove(n)

def enableAllShaderNodes():
    for obj in bpy.context.scene.objects:
        if (obj.type == 'MESH') or (obj.type == 'CURVE'):
            print("Disabling Shader Nodes for MESH: " + obj.name)
            bpy.context.scene.objects.active = obj
            bpy.context.object.active_material.use_nodes = True 

def disableAllShaderNodes():
    for obj in bpy.context.scene.objects:
        if (obj.type == 'MESH') or (obj.type == 'CURVE'):
            print("Disabling Shader Nodes for MESH: " + obj.name)
            bpy.context.scene.objects.active = obj
            bpy.context.object.active_material.use_nodes = False

def configureDepthMapNodes():
    # Set up rendering of depth map:
    bpy.context.scene.use_nodes = True
    tree = bpy.context.scene.node_tree
    links = tree.links

    # Clear default nodes if they exist
    for n in tree.nodes:
        tree.nodes.remove(n)

    # Create input render layer node
    nRenderLayers = addNode(tree, 'CompositorNodeRLayers', 0, 100)
    
    # Create MapRange node (for depth only)
    nMapRange = addNode(tree, 'CompositorNodeMapRange', 200, 0)
    # map.inputs["From Min"].default_value = bpy.data.cameras[bpy.context.scene.camera.name].clip_start
    nMapRange.inputs["From Min"].default_value = 0
    # From Max should probably align with camera's end clipping
    # map.inputs["From Max"].default_value = bpy.data.cameras[bpy.context.scene.camera.name].clip_end
    nMapRange.inputs["From Max"].default_value = 20
    nMapRange.inputs["To Min"].default_value = 0
    nMapRange.inputs["To Max"].default_value = 1
    # Link RenderLayers->Z to MapRange->Value
    links.new(nRenderLayers.outputs[2], nMapRange.inputs[0])

    # Create Composite Node
    nComposite = addNode(tree, 'CompositorNodeComposite', 400, 0)
    # Link MapRange->Value to Composite->Image
    links.new(nMapRange.outputs[0], nComposite.inputs[0])

    # Create File Output Node
    # Reference the global variable so the file_slots entries can be easily updated later
    global nFileOutput
    nFileOutput = addNode(tree, 'CompositorNodeOutputFile', 400, 200)
    nFileOutput.base_path = outputPath
    nFileOutput.file_slots.clear()
    # These will be updated later in render loop
    nFileOutput.file_slots.new("RGB Temp")
    nFileOutput.file_slots.new("Depth Temp")

    #Create Links to File Output Node
    links.new(nRenderLayers.outputs[0], nFileOutput.inputs[0])
    links.new(nMapRange.outputs[0], nFileOutput.inputs[1])

def configureShaderNodesNormals():
    for obj in bpy.context.scene.objects:
        if (obj.type == 'MESH') or (obj.type == 'CURVE'):
            print("Enabling Shader Nodes for " + obj.type + ": " + obj.name)
            bpy.context.scene.objects.active = obj

            # Remove Particle Systems from objects 
            # (i.e. for our purposes, a shag carpet should act as a totally flat surface)
            if len(obj.particle_systems.keys()) > 0:
                numParticles = len(obj.particle_systems.keys())
                while (numParticles > 0):
                    bpy.ops.object.particle_system_remove()
                    numParticles = numParticles - 1
            
            # Clear existing materials, and replace with a new one
            newMat = bpy.data.materials.new('tempMaterial')
            # Clear first to handle case where there is an active material, but it's empty!
            obj.data.materials.clear()
            obj.data.materials.append(newMat)

            # Create Shader Nodes
            obj.active_material.use_nodes = True
            nodeTree = obj.active_material.node_tree
            nodeLinks = nodeTree.links

            # Clear default nodes if they exist
            for n in nodeTree.nodes:
                nodeTree.nodes.remove(n)

            # Create Input -> Geometry node
            nGeom = addNode(nodeTree, 'ShaderNodeNewGeometry', 200, 200)

            # Create Vector -> Vector Transform node (normal/world/camera)
            nVecTrans = addNode(nodeTree, 'ShaderNodeVectorTransform', 400, 400)
            nVecTrans.vector_type = 'NORMAL'
            nVecTrans.convert_from = 'WORLD'
            nVecTrans.convert_to = 'CAMERA'

            # Create Converter -> Vector Math node (normalize)
            nVecMathNormalize = addNode(nodeTree, 'ShaderNodeVectorMath', 600, 400)
            nVecMathNormalize.operation = 'NORMALIZE'

            # Create Converter -> Vector Math node (cross product)
            nVecMathCrossProd = addNode(nodeTree, 'ShaderNodeVectorMath', 800, 400)
            nVecMathCrossProd.operation = 'CROSS_PRODUCT'

            # Create Converter -> Vector Math node (normalize)
            nVecMathNormalize2 = addNode(nodeTree, 'ShaderNodeVectorMath', 1000, 400)
            nVecMathNormalize2.operation = 'NORMALIZE'

            # Create Color -> MixRGB node (multiply)
            nMixRGB = addNode(nodeTree, 'ShaderNodeMixRGB', 1200, 400)
            nMixRGB.blend_type = 'MULTIPLY'
            nMixRGB.inputs[0].default_value = 1

            # Create Vector -> Mapping node (point)
            nMapping = addNode(nodeTree, 'ShaderNodeMapping', 1400, 400)
            nMapping.vector_type = 'POINT'
            nMapping.translation[0] = math.pi
            nMapping.translation[1] = math.pi
            nMapping.translation[2] = math.pi

            # Create Vector -> Mapping node (point)
            nMapping2 = addNode(nodeTree, 'ShaderNodeMapping', 1800, 400)
            nMapping2.vector_type = 'POINT'
            nMapping2.scale[0] = 1 / (2 * math.pi)
            nMapping2.scale[1] = 1 / (2 * math.pi)
            nMapping2.scale[2] = 1 / (2 * math.pi)

            # Create Converter -> Separate RGB node
            nSeparateRGB = addNode(nodeTree, 'ShaderNodeSeparateRGB', 2200, 100)

            # Create Converter -> Combine RGB node
            nCombineRGB = addNode(nodeTree, 'ShaderNodeCombineRGB', 2400, 0)

            # Create Input -> RGB node (0,0,1)
            nRGB = addNode(nodeTree, 'ShaderNodeRGB', 400, 200)
            nRGB.outputs[0].default_value[0] = 0
            nRGB.outputs[0].default_value[1] = 0
            nRGB.outputs[0].default_value[2] = 1

            # Create Input -> Value node
            nValue = addNode(nodeTree, 'ShaderNodeValue', 400, 0)
            nValue.outputs[0].default_value = -1

            # Create Color -> MixRGB node (multiply)
            nMixRGB2 = addNode(nodeTree, 'ShaderNodeMixRGB', 600, 200)
            nMixRGB2.blend_type = 'MULTIPLY'
            nMixRGB2.inputs[0].default_value = 1

            # Create Converter -> Vector Math node (dot product)
            nVecMathDotProd = addNode(nodeTree, 'ShaderNodeVectorMath', 800, 200)
            nVecMathDotProd.operation = 'DOT_PRODUCT'

            # Create Converter ->  Math node (Arc Cosine)
            nArcCos = addNode(nodeTree, 'ShaderNodeMath', 1000, 200)
            nArcCos.operation = 'ARCCOSINE'
            nArcCos.inputs[1].default_value = 1

            # Create Vector -> Vector Transform node (vector/world/camera)
            nVecTrans2 = addNode(nodeTree, 'ShaderNodeVectorTransform', 400, -100)
            nVecTrans2.vector_type = 'VECTOR'
            nVecTrans2.convert_from = 'WORLD'
            nVecTrans2.convert_to = 'CAMERA'

            # Create Converter -> Vector Math node (normalize)
            nVecMathNormalize3 = addNode(nodeTree, 'ShaderNodeVectorMath', 600, -100)
            nVecMathNormalize3.operation = 'NORMALIZE'

            # Create Converter -> Vector Math node (dot product)
            nVecMathDotProd2 = addNode(nodeTree, 'ShaderNodeVectorMath', 800, -100)
            nVecMathDotProd2.operation = 'DOT_PRODUCT'

            # Create Converter ->  Math node (Arc Cosine)
            nArcCos2 = addNode(nodeTree, 'ShaderNodeMath', 1000, -100)
            nArcCos2.operation = 'ARCCOSINE'
            nArcCos2.inputs[1].default_value = 1

            # Create Converter ->  Math node (Multiply)
            nMultiply = addNode(nodeTree, 'ShaderNodeMath', 1200, -100)
            nMultiply.operation = 'MULTIPLY'
            nMultiply.inputs[1].default_value = 1 / math.pi

            # Create Shader->Emission node
            nEmission = addNode(nodeTree, 'ShaderNodeEmission', 2600, 0)
            nEmission.inputs["Strength"].default_value = 1

            # Create Output Material node
            nMaterialOutput = addNode(nodeTree, 'ShaderNodeOutputMaterial', 2800, 0)

            # Link Geometry (True Normal) -> VectorTransform Normalize
            nodeLinks.new(nGeom.outputs[3], nVecTrans.inputs[0])

            # Link Vector Transform (Normal/World/Cam) -> VectorMath Normalize
            nodeLinks.new(nVecTrans.outputs[0], nVecMathNormalize.inputs[0])

            # Link Geometry (Incoming) -> VectorTransform.Vector
            nodeLinks.new(nGeom.outputs[4], nVecTrans2.inputs[0])

            # Link RGB (0,0,1) -> MixRGB Multiply
            nodeLinks.new(nRGB.outputs[0], nMixRGB2.inputs[1])

            # Link Value (-1) -> MixRGB Multiply
            nodeLinks.new(nValue.outputs[0], nMixRGB2.inputs[2])

            # Link Vector Transform (Vector/World/Camera) -> Normalize
            nodeLinks.new(nVecTrans2.outputs[0], nVecMathNormalize3.inputs[0])

            # Link Normalize (Vector) -> Dot Product
            nodeLinks.new(nVecMathNormalize3.outputs[0], nVecMathDotProd2.inputs[1])

            # Link Normalize (Vector) -> Cross Product
            nodeLinks.new(nVecMathNormalize.outputs[0], nVecMathCrossProd.inputs[0])

            # Link Dot Prod (Value) -> Arccos
            nodeLinks.new(nVecMathDotProd2.outputs[1], nArcCos2.inputs[0])

            # Link Arccos -> Multiply
            nodeLinks.new(nArcCos2.outputs[0], nMultiply.inputs[0])

            # Link Multiply -> Combine RGB (B)
            nodeLinks.new(nMultiply.outputs[0], nCombineRGB.inputs[2])

            # Link Vector Math Normalize (Vector) -> Vector Math Dot Prod
            nodeLinks.new(nVecMathNormalize.outputs[0], nVecMathDotProd.inputs[0])

            # Link MixRGB -> Vector Math Cross Prod
            nodeLinks.new(nMixRGB2.outputs[0], nVecMathCrossProd.inputs[1])

            # Link MixRGB -> Vector Math Dot Prod
            nodeLinks.new(nMixRGB2.outputs[0], nVecMathDotProd.inputs[1])

            # Link MixRGB -> Vector Math Dot Prod
            nodeLinks.new(nMixRGB2.outputs[0], nVecMathDotProd2.inputs[0])

            # Link Cross Prod (Vector) -> Vector Math Normalize
            nodeLinks.new(nVecMathCrossProd.outputs[0], nVecMathNormalize2.inputs[0])

            # Link Dot Prod (Value) -> Arc Cos
            nodeLinks.new(nVecMathDotProd.outputs[1], nArcCos.inputs[0])

            # Link Vector Math Normalize (Vector) -> Mix RGB
            nodeLinks.new(nVecMathNormalize2.outputs[0], nMixRGB.inputs[1])

            # Link Arccos -> MixRGB
            nodeLinks.new(nArcCos.outputs[0], nMixRGB.inputs[2])

            # Link Mix RGB (Multiply) -> Mapping
            nodeLinks.new(nMixRGB.outputs[0], nMapping.inputs[0])

            # Link Mapping -> Mapping2
            nodeLinks.new(nMapping.outputs[0], nMapping2.inputs[0])

            # Link Mapping2 -> Separate RGB
            nodeLinks.new(nMapping2.outputs[0], nSeparateRGB.inputs[0])

            # Link Separate RGB (R) -> Combine RGB (R)
            nodeLinks.new(nSeparateRGB.outputs[0], nCombineRGB.inputs[0])

            # Link Separate RGB (G) -> Combine RGB (G)
            nodeLinks.new(nSeparateRGB.outputs[1], nCombineRGB.inputs[1])

            # Link Combine RGB (image) -> Emission
            nodeLinks.new(nCombineRGB.outputs[0], nEmission.inputs[0])

            # Link Emission -> Output Material
            nodeLinks.new(nEmission.outputs[0], nMaterialOutput.inputs[0])

def renderAllCameras(rendType, renderEngine):

    if rendType == "RGB":
        # Just render the scene from this camera, as-is using default renderer, and save to a file
        bpy.context.scene.render.engine = renderEngine

    elif rendType == "DEPTH":
        # Enable compositing nodes for the scene, and render the depth map with CYCLES
        bpy.context.scene.render.engine = renderEngine
        bpy.context.scene.use_nodes = True

        # Make sure Properties -> Render -> Post Processing -> Compositing is CHECKED
        #bpy.context.scene.render.use_compositing = True

    elif rendType == "NORMALS":
        # Disable compositing nodes and render the normal map with CYCLES
        bpy.context.scene.render.engine = renderEngine
        bpy.context.scene.use_nodes = False

    else:
        print("Error: rendType <" + rendType + "> not valid.")
        return

    # Optimze render settings
    bpy.context.scene.render.threads_mode = 'AUTO'

    if bpy.context.scene.render.engine == 'BLENDER_RENDER':
        bpy.context.scene.render.tile_y = 128
        bpy.context.scene.render.tile_x = 128
    elif bpy.context.scene.render.engine == 'CYCLES':
        bpy.context.scene.render.tile_y = 16
        bpy.context.scene.render.tile_x = 16

    # Loop through each camera and render
    for obj in bpy.context.scene.objects:
        if obj.type == 'CAMERA':
            print("Current Camera: " + obj.name)
            # Set active camera
            bpy.context.scene.camera = obj

            bpy.context.scene.frame_end = getLastKeyFrameForCamera(obj)

            blendFile = os.path.splitext(bpy.path.basename(bpy.context.blend_data.filepath))[0]
            bpy.data.scenes[currentScene.name].render.filepath = outputPath + "/" + outputFilePrefix + blendFile + "-" + currentScene.name + "-" + obj.name + "-" + rendType
            
            if rendType == "NORMALS":
                bpy.ops.render.render(write_still=True, animation=renderAnimation)
            else:
                blendFile = os.path.splitext(bpy.path.basename(bpy.context.blend_data.filepath))[0]
                # Update Filenames based on current active camera
                nFileOutput.file_slots[0].path = outputFilePrefix + blendFile + "-" + currentScene.name + "-" + obj.name + "-RGB"
                nFileOutput.file_slots[1].path = outputFilePrefix + blendFile + "-" + currentScene.name + "-" + obj.name + "-DEPTH"

                bpy.ops.render.render(write_still=False, animation=renderAnimation)

# MAIN
for currentScene in bpy.data.scenes :
    print("Current Scene: " + currentScene.name)
    # Set active scene
    bpy.context.screen.scene = currentScene

    # Capture original settings
    origRenderEngine = bpy.context.scene.render.engine
    print("Original Renderer for Scene * " + currentScene.name + " * is: " + origRenderEngine)

    # Render Settings
    bpy.context.scene.render.resolution_x = resolutionX
    bpy.context.scene.render.resolution_y = resolutionY
    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.render.image_settings.file_format=fileFormat
    bpy.context.scene.render.image_settings.color_mode = 'RGB'
    bpy.context.scene.render.image_settings.color_depth = '16'
    bpy.context.scene.render.image_settings.compression = fileCompression

    # Color Management
    bpy.context.scene.sequencer_colorspace_settings.name = 'Linear'
    bpy.context.scene.display_settings.display_device = 'None'

    bpy.context.scene.frame_current = bpy.context.scene.frame_start

    # Fix end frame for scene based on camera keyframes
    bpy.context.scene.frame_end = getLastKeyFrameInScene()
    
    configureDepthMapNodes()
    # This will now render BOTH RGB + DEPTH in a single pass, via Compositing File Output Node
    renderAllCameras("DEPTH", origRenderEngine)

    configureShaderNodesNormals()
    renderAllCameras('NORMALS', 'CYCLES')
