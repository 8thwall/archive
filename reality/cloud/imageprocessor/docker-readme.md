### Goal
This document is a guide to using docker and the `docker_image` bazel rule.
It explains how to use docker & AWS to automate the process of creating and running a container on AWS ECS.
This guide specifically outlines how to use `imageprocessor-local`.

### TODO
- Automatically push the image to Amazon ECR
  + https://github.com/8thwall/code8/pull/19085
- Automatically spin up and run a container on EC2
- Copy over information either to S3, cli ect...

### How to create a docker image
1. Create your script files as desired. This can be done via the same bzl rules you are used to using.
    - Look at the `imageprocessor-local` `docker_image` bazel rule in `reality/cloud/imageprocessor/BUILD`.
2. Create a `docker_image` rule with `main` set to the entry point of your code ie: the file you want to run.
    - bazel build //reality/cloud/imageprocessor:{Name of docker_image rule} --cpu=amazonlinux8 --dynamic_mode=off

3. Run `bazel build //path/to/folder:{Name of docker_image rule} --cpu=amazonlinux8 --dynamic_mode=off`
    - This will create a docker image with the name: {Name of docker_image rule}.
    - By default the entry point will be bin/bash.
    - `bazel run` will also run a docker container with the entrypoint being the main method.
4. More customization
    - The docker bazel rule will create and load all of the needed dependencies into the folder bin8.
    - It will model the code8 folder style and path.
    - If you want to have custom behavior for you docker container after running your code, you can
    call docker run such as: `docker run -it -p 80:80  --rm  --name rishilocalserver1 --entrypoint bash imageprocessor-local`.
      - `-p` will expose port 80 to docker container port 80. This is different from adding `ports = ["80"]`. You must have this in both the docker image and docker run command.
      - `--entrypoint bash` will attach the container to your terminal and allow you to interact with it via
      command line.
      - `imageprocessor-local` should be replaced with the name of your docker_image rule.
      - `--name` -> name your container. Conversely you can just remove this and use docker ps to list all running containers.

### Example - `//reality/cloud/imageprocessor`
1. Initial set up:
    - Download the docker app: `brew install --cask docker`
    - Open docker app manually go through the tutorial / getting started steps
        + There is no need to sign into dockerhub we use AWS ECR
    - Download initial image: `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com`
        + this is the image that includes the environment we build off of.
    - `docker pull <REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com/amazonlinux8`
    - Call `docker images` to check your latest images. You should see the image `<REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com/amazonlinux8`
2. Create executable file such as `imageprocessor`
    - This is just an executable bazel rule look at `reality/cloud/imageprocessor/BUILD` for 'imageprocessor' rule
    - This can be replaced with any executable file.
3. Create `docker_image` rule named `imageprocessor-local`
    - main -> the executable
    - data -> any files that you will need to access while running your script. This includes files such as images.
    - NOTE: All files will mantain the same relative filepath so you can call "reality/cloud/imageprocessor/images/target_bad.png"
    if it is included in your data file.
    - port -> do you want to expose any ports? will expose port x on local computer to port x on the docker image. You will still need to include (-p x:x) in the docker run command
      + the created docker run command when calling `bazel run` will include this port.
4. The primary entrypoint into your code, and to run it most times, call:
    `bazel run //reality/cloud/imageprocessor:imageprocessor-local --cpu=amazonlinux8 --dynamic_mode=off`
    - `--cpu=amazonlinux8 --dynamic_mode=off` are needed
5. If you want to inspect the contents of your docker container or do anything more advanced, you may need to run docker manually.
    - can manually call `docker run -it -p 80:80  --rm  --name rishilocalserver1 --entrypoint bash imageprocessor-local`

6. Push the image to AWS ECR
    - `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com`
    - `docker tag image-processor:latest <REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com/image-processor:latest`
    - `docker push <REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com/image-processor:latest`

**AWS ECR**

- Create an image repository on AWS ECR. This can be done either via API or through the AWS UI.
  - Only done once for initial set up.
- Push local image to ECR
  - `docker build {image name}`
  - `docker tag {image name} {aws image name}:latest`
  - `docker push {aws image name}`
- For detailed steps click `view push commands` in ECR UI.
- AWS will try to run the latest container. However, if you are using a specific port, it might fail to
run the container and you will have to TODO (rishi) find best way to restart the instance.

**Helpful Docker commands**
1. `docker images` -> will list all of your current images
2. `docker ps` -> will list all of your running containers.
3. `cmd p  cmd q` -> will unattach the docker container from your terminal but leave the container running
4. `docker attach {container name}` will attach docker container to your terminal
5. `docker stop {container name}` will stop and remove the docker container
6. `-entrypoint {command}` will allow you to run a specific command at the initialization of the container
