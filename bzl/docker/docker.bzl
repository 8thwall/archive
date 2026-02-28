"""
WARNING: This set of rules is not hermetic, it will not work unless you have set up docker locally.

This module defines a Bazel rule for creating Docker images.
It includes functionality for generating Dockerfiles, build scripts, and run scripts.
"""

load("//bzl/runfiles:materialize-node-runfiles.bzl", "materialize_node_runfiles")

def _docker_image_impl(ctx):
    # outputs
    outs = [
        # The output script to run docker with the main entry point.
        ctx.actions.declare_file(ctx.label.name),
        # The docker file to copy content and configure the docker image.
        ctx.actions.declare_file(ctx.label.name + ".Dockerfile"),
        # A helper script to set up the docker build tmp dir and run docker build.
        ctx.actions.declare_file(ctx.label.name + ".docker-build.sh"),
        # The console output of docker build process.
        ctx.actions.declare_file(ctx.label.name + ".docker-build.out"),
    ]

    # A temporary directory where we copy all of the files that need to go into the
    # docker container.
    docker_tmp_dir = outs[0].path + ".docker"

    # Files that should be in the docker container.
    container_files = []
    container_files.extend(ctx.files.main)
    container_files.extend(ctx.files.data)

    # Running into "max depth exceeded" when there are too many COPY commands in the dockerfile.
    def is_subdir(parent, child):
        return child.startswith(parent + "/")

    def minimal_parents(dirs):
        dirs = sorted(dirs)
        result = []

        for b in dirs:
            found = False
            for parent in result:
                if is_subdir(parent, b):
                    found = True
                    break
            if not found:
                result.append(b)
        return result

    container_dirnames = []
    seen = {}
    for f in container_files:
        if f.dirname not in seen:
            container_dirnames.append(f.dirname)
            seen[f.dirname] = True
    unique_dirnames = minimal_parents(container_dirnames)

    if ctx.attr.targetNode:
        docker_file_content = """FROM node:18-slim\n"""
    else:  # Write the docker file starting with a vanilla amazonlinux container.
        docker_file_content = """FROM <REMOVED_BEFORE_OPEN_SOURCING>.dkr.ecr.us-west-2.amazonaws.com/amazonlinux8
    WORKDIR /usr/bin8
    """

    # Add files that need to be copied to the container into the dockerfile.
    for d in unique_dirnames:
        # For consistency, we want to move files over using their "short path"
        bin_str = "bin/"
        bin_index = d.find(bin_str)

        if bin_index != -1:
            short_path = d[bin_index + len(bin_str):]
        else:
            short_path = d

        docker_file_content += "COPY {} ./{}\n".format(d, short_path)

    # Assuming debian based image, install packages.
    if ctx.attr.packages:
        docker_file_content += "RUN apt-get update"
        for p in ctx.attr.packages:
            docker_file_content += " && apt-get install -y {}".format(p)
        docker_file_content += "\n"

    # Add requested ports to the docker file.
    for p in ctx.attr.ports:
        docker_file_content += "EXPOSE {}\n".format(p)

    if ctx.attr.targetNode:
        docker_file_content += "CMD [\"node\", \"{}\"]".format(ctx.files.main[0].short_path)
    else:
        # By default, start with bash as an entry point.
        docker_file_content += "ENTRYPOINT [\"{}\"]".format(ctx.files.main[0].short_path)

    # Write the docker file.
    ctx.actions.write(
        output = outs[1],
        content = docker_file_content,
        is_executable = False,
    )

    # Create a build script that will copy the docker file and all files that need to be
    # in docker into a temporary folder before invoking docker build. Then remove the temporary
    # directory.
    docker_build_script = """#!/bin/bash
mkdir -p {}
cp -f {} {}/Dockerfile
""".format(docker_tmp_dir, outs[1].path, docker_tmp_dir)

    for f in container_files:
        docker_build_script += "mkdir -p {}\ncp -f {} {}\n".format(
            docker_tmp_dir + "/" + f.dirname,
            f.path,
            docker_tmp_dir + "/" + f.path,
        )

    docker_build_script += "DOCKER_BUILDKIT=0 /usr/local/bin/docker build -t {} {} &> {}\n".format(
        ctx.label.name,
        docker_tmp_dir,
        outs[3].path,
    )

    docker_build_script += "rm -rf {}".format(docker_tmp_dir)

    ctx.actions.write(
        output = outs[2],
        content = docker_build_script,
        is_executable = True,
    )

    # Run the script that does copying. This produces an output because bazel needs one.
    files_for_build = [outs[1]]
    files_for_build.extend(container_files)

    ctx.actions.run(
        inputs = files_for_build,
        outputs = [outs[3]],
        executable = outs[2],
    )

    # Generate the run script that invokes the container at the correct entrypoint.
    # This arg splitting allows us to pass "docker run" arguments and arguments to the underlying
    # executable using this pattern:
    #   bazel run //fake:rule --config=linuxrun -- --dockerrun_arg=val1 -- --exe_arg=val2
    shell_file_content = "\n".join([
        "#!/bin/bash",
        "ARGS=( \"$@\" )",
        "NUM_ARGS=$#",
        "ARGSPLIT=$#",
        "while [ $# -gt 0 ]",
        "do",
        "  case \"$1\" in",
        "    --)",
        "    ARGSPLIT=$(($NUM_ARGS - $#))",
        "    break",
        "    ;;",
        "  esac",
        "  shift",
        "done",
        # These are the dockerrun arguments.
        "docker run --rm -it \"${ARGS[@]:0:${ARGSPLIT}}\"",
    ])

    for p in ctx.attr.ports:
        shell_file_content += " -p {}:{} ".format(p, p)

    shell_file_content += " {}".format(ctx.label.name)

    # These are the arguments to the executable run inside the Docker container.
    shell_file_content += " \"${ARGS[@]:$((${ARGSPLIT}+1))}\""

    ctx.actions.write(
        output = outs[0],
        content = shell_file_content,
        is_executable = True,
    )

    # outs should be a shell script that contains a docker run command
    return [DefaultInfo(
        files = depset(outs),
        executable = outs[0],
        runfiles = None,
    )]

_docker_image = rule(
    attrs = {
        "main": attr.label_list(
            allow_files = False,
            default = [],
        ),
        "data": attr.label_list(
            allow_files = True,
            default = [],
        ),
        "packages": attr.string_list(
            default = [],
        ),
        "ports": attr.string_list(),
        "targetNode": attr.bool(
            # TODO(lreyna): Get docker_image to work with node binary from WORKSPACE
            default = False,
        ),
    },
    implementation = _docker_image_impl,
    executable = True,
)

# Copies data to a docker container and generates a run script that invokes the main file
# with an optional extra runner wrapper.
def docker_image(name, main = [], data = [], ports = [], visibility = None, tags = [], testonly = False, targetNode = False, packages = []):
    node_assets_name = "{}-node-assets".format(name)
    if targetNode:
        materialize_node_runfiles(
            name = node_assets_name,
            deps = data,
            wasm_deps = [],
        )

    _docker_image(
        name = name,
        main = main,
        visibility = visibility,
        data = data + ([node_assets_name] if targetNode else []),
        ports = ports,
        tags = tags,
        testonly = testonly,
        targetNode = targetNode,
        packages = packages,
    )
