import os

# Get the face data from the .obj value.
# vertex/uv/normal
INDICES = []
with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'hand-with-uv.obj'), 'r') as f:
    for line in f:
        if line.startswith('f '):
          INDICES.append(line)


# For each line we want to extract the UV and convert it to a c++ vector.
print('const c8::Vector<c8::MeshIndices> HANDMESH_R_UV_INDICES = {')
for i, line in enumerate(INDICES):
    line = line.replace('\n', '')
    tris = line.split(' ')[1:]

    # We also want to subtract by 1, since they're 1-indexed instead of 0-indexed.
    uv_index = [str(int(tri.split('/')[1]) - 1) for tri in tris]

    # Print it out like a c8::MeshIndices.
    print('   {' + ', '.join(uv_index) + '},')
print('};')
