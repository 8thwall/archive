
#facemesh-uvs
`facemesh-uvs.cc` is a utility tool for extracting UV points from mesh_map.png.
This image was provided by Google via:
	 https://github.com/tensorflow/tfjs-models/tree/master/facemesh.
It contains the index of each point in UV space.  The index corresponds to the vertex's index in
the output layer of the Facemesh neural network.

We attempted to use OCR tools like Tesseract or https://ocr.space/ocrapi for getting the numbers
for each point but they performed poorly. Therefore we still had to manually link up each point
with its index.  You can find that information here:
	https://docs.google.com/spreadsheets/d/<REMOVED_BEFORE_OPEN_SOURCING>

The UV array is in order, so you don't need the google docs link.
