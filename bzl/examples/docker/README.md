### Background
This example is based off of `reality/cloud/imageprocessor/docker-readme.md`.

### How to run
1) Follow the steps from `docker-readme.md` to download Docker and the `amazonlinux8` image.
2) To build a linux executable and run it inside a docker container, run:
```
bazel run //bzl/examples/docker:hello-cc-docker \
--platforms=//bzl:amazonlinux -- \
--mount type=bind,source=/absolute/path/to/datasets/dir,target=/root/datasets -- hello=moto
```
The arguments to docker vs the executable are split by "--" so the first argument goes to the docker
run command and the second argument is passed to this executable.
