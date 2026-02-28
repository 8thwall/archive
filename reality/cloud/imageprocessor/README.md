**Image Processor Readme**

@author: Rishi {rishi@8thwall.com}

Purpose:
Output an image target score to tell customers how well their image target will perform. We currently use 3 metrics - feature point score, similarity score, and detection score.

**TODO**
+ create an AWS rule for accessing s3
+ create / customize the PDF generation.
    - https://github.com/8thwall/code8/pull/18690
+ save the rendered scenes to S3 {product team input here}
+ add a render boolean to the JSON input for different behavior if we want to output a score or visualization.
    - Should save images to `reality/cloud/imageprocessor/images/{image name}`
    - reccomended names : similarity.png, detection_{pose #}.png, features.png
+ {Possible suggestion for improvement} change feature point grid to be 9x12 (since all images are 3x4) and normalize to 100


**TLDR**

- feature point score:
    + A score of 60+ has shown (in current testing) to be able to have high detection. However, more is always better.
    + Visualization -> heat map defined by colors (worst to best) black -> red -> yellow
    -> white
- hamming distance:
    + Good images have scores of hamming distances of roughtly 70+
    + Visualization -> black/red patches placed on poor performing feature points.
- detection image:
    + typically a score of 80+ is considered good (most good images get a score of 100 and poor images get a score of
    less than 60).
    + Visualization {need to decide what the best visualization is}
        - If an image is not detected, a grey scale rendering of the scene will be output
        - If an image is detected, a grey scale rending with a box aroung the predicted target image will be output


**Files**

1. `main.ts` -> the main entry point to the express server
2. `compute.ts` -> Contains the method for how to handle the post request to calculate image target score. Calls the needed C++ and JS scripts to generate the output of the scripts.
3. `calc-score.cc` -> The main C++ script used to calculate the image target score. Calls methods from calc-detection-score.cc, `calc-similarity-score.cc`, and calc-feature-point-score.cc.
4. `calc-sub-scores.h` header file for calc-detection-score.cc, calc-similarity-score.cc, and calc-feature-point-score.cc.
5. `image-blur.frag`, `image-blur.vert` -> shader files for the renderer to create a gaussian blur for heatmap visualization.
6. `create-pdf.ts` -> sample of a configurable pdf renderer. Can take in JSON input and output a customized pdf.
7. `images/` -> folder containing test images and other needed files for running.
8. `calc-score-test.cc` a unit test for this folder that calls the three calc-{}-score methods. Since these are image outputs, the easiest way to check is manually see if the output makes sense.
    - `calc-score-test` shows how to use the different methods to get individual scores, load files, and save images as well as unit testing for 3 cases: bad image target, bad image target horizontal, and good image target.

**Steps**
1. Feature Point Score:

    - feature point score analysis: https://colab.research.google.com/drive/1Tlq7ODxB9Uj270BczrgHZcpXB-1Tg3MT

    - An image can have up to 2500 feature points. Found that a cut-off of 10 feature points per grid box for a 10x10 grid is a reasonable cutoff for a good/bad feature score. Any score of region that had less than 10 points was considered a bad point. We generate the score by using a logistic curve centered around 10.

    -  A low score can mean that an image will be poor to detect. However, a high number of poor feature points is not always
    good.

    - We should emphasize to clients that having blank or feature-less regions of the image can lead to ppor perfomance even if the image itself has lots of featuers.

2. Similarity Scores

    - similarity score analysis: https://colab.research.google.com/drive/1INJ1g5yuPh_wi9XAm-tT01feLuk7BHk1

    - Similar feature points can often be confused with each other. One possible way to test the similarity of feature points
    is to look at hamming distances. We compute pairwise hamming distances between all feature points (2500x2499) grid. We define
    a feature points's score to be the minimum hamming distance.

    - Found that a hamming distance of less than 30 is sufficiently similar for a pair of descriptors to be bad.

    - Most images will have at least a couple poor feature points. A feature point score of ~70 is common in good targets.

    - One thing to note is that having a small number of feature points can still score high in similarity score.

    - Should emphasize to clients that repeated elements or very similar elements can easily be confused with each other. Bad features that have this effect include text and repeating patterns.

3. Detection in Scene
    - Detection in scene is a metric created by simulating the target image in a scene at various camera poses.

    - We try to detect the target image in the rendered scene. If we are able to closely detect each corner
    (within a distance of 20px) we consider the scene to be accurately detected.

    - Currently we test on 5 deterministic poses that range in difficulty of being detected.

    - We change camera position, rotation, and distance to synthetically create increasing difficulty.

    - Pose 5 is a simple pose with no change in camera position. This is meant to be a baseline.

    - Currently the rendered scenes (and bounding boxes) are passed in and saved to a vector of
    RGBA8888PlanePixelBuffer

    - Should emphasize that this is the closest to testing detection of the three metrics. However, manual testing is the best way to check detection.

4. Creating Scoring Metrics
    - Generated initial files for scoring metrics and created sample visualizations to compare how useful the metric actually is.

    - https://docs.google.com/presentation/d/<REMOVED_BEFORE_OPEN_SOURCING>

    - Found that the scoring metrics worked reasonably in differentiating between our good and bad samples.

5. Setting up server in the docker container
    - Created a temporary docker file to run these scripts on a docker container.
    - Now the creation of a docker file and copying over all needed files via bazel build rule for docker_image (see example in BUILD File)
    - Correctly exposed port and node version for docker.
    - Entry point of the docker container should run the main script.
    - For AWS this entrypoint has to be put in as bin bash (default), but the command should be `./reality/cloud/imageprocessor/imageprocessor`
    - More information about DOCKER can be found in the DOCKER readme. TODO (Rishi)

6. Creating visualizations for client facing scores.
    -  Feature point score -> a heatmap to represent regions with good vs bad feature points. Black/red means bad and yellow/white means good
        - Sometimes the edges have a poor score, but that is ok if the majority of the image has a good score.
        - Added a new shader to correctly add a gaussian blur to the top image.
        - Renders the heatmap as a quad and adds it to the top of the original image.
    - Similarity score -> Adds red dots of decaying opacity (A value of RGBA) to poor performing feature points determined by the feature point score.
    - https://docs.google.com/presentation/d/<REMOVED_BEFORE_OPEN_SOURCING>
    - Detection Image -> output the rendered scene and bounding box for the predicted points.
    - If a box was not created, then the image was not detected.

**Commands and steps to run**

+ {run the container locally} `bazel run //reality/cloud/imageprocessor:imageprocessor-local --cpu=amazonlinux8 --dynamic_mode=off`

+ curl command `curl -d '{"filename": "selfies/1.jpg", "render": "true"}' -H 'Content-Type: application/json' :80/compute`

+ {build the container} bazel build //reality/cloud/imageprocessor:imageprocessor-local --cpu=amazonlinux8 --dynamic_mode=off

+ {push the container to AWS} `sh push-docker-image.sh imageprocessor-local` (still in testing)
    - https://github.com/8thwall/code8/pull/19085

+ {run docker container using docker run} `docker run --rm -it  -p 8888:8888 imageprocessor-local`
