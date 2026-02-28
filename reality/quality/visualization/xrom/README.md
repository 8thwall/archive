# XROM
### XROM is deprecated.  We now use Object8 + Omniscope.

The basic idea for xrom was that we could specify a scene-graph like structure in a backend and then
serialize it and send it to a frontend to render.  There was a frontend built off of unity and one
built off opencv 2d/3d drawing functions.  The unity frontend took about 20 minutes to compile
and it wasn't really easy to code with on the backend.  Coupled with the fact that using dynamic
data with capnproto was cumbersome, xrom ended up being too hard to use.  We have since used
Object8 and Omniscope to visualize our algorithms.
