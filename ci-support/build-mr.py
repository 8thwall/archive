import argparse
import subprocess as sp
import sys
import shlex
import itertools
import pathlib
import platform
import re
import ast

# This script queries GitHub for files in a commit, identifies
# related build targets, and builds only those targets.
# Used by Jenkins to build pull requests.

def bazelCmd(cmd, args, implicitFlags=[], ignoreErrors = False, verbose = False, bazelArgs=[]):
    full_args = ['bazel', cmd] + implicitFlags + args + bazelArgs
    if verbose:
        print('$', ' '.join([f"'{x}'" if " " in x else x for x in full_args]))
    result = sp.run(full_args, stdout=sp.PIPE, stderr=sp.PIPE)
    if result.returncode != 0 and not ignoreErrors:
        print('ERROR', result.stderr.decode('utf-8').rstrip(), file=sys.stderr)
        exit(1)
    return result.stdout.decode('utf-8')

def findTargets(buildFile, inputs, attrs, excludeTags=['manual']):
    if buildFile.is_dir():
        return []
    targetCandidates = []
    # Find bazel targets in the buildFile that have a file in inputs as an input.
    buildFileContent = buildFile.read_text()
    tree = ast.parse(buildFileContent, filename=buildFile)
    for node in ast.walk(tree):
        # Find top-level call nodes, i.e. Bazel targets.
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call) and node.col_offset == 0:
            ruleName = None
            ruleHasFileAsInput = False
            exclude = False
            for keyword in node.value.keywords:
                if keyword.arg == 'name':
                    if isinstance(keyword.value, ast.Str):
                        ruleName = keyword.value.s
                if keyword.arg == 'tags':
                    for subNode in ast.walk(keyword.value):
                        if isinstance(subNode, ast.Str):
                            if subNode.s in excludeTags:
                                exclude = True
                if keyword.arg in attrs:
                    for subNode in ast.walk(keyword.value):
                        if isinstance(subNode, ast.Str):
                            if subNode.s in inputs:
                                ruleHasFileAsInput = True
                            elif (":" not in subNode.s and
                                  "{}:{}".format(subNode.s, subNode.s.split("/")[-1]) in inputs):
                                # Handle case of implicit target name, e.g. "//foo" for "//foo:foo".
                                ruleHasFileAsInput = True

            if ruleName and ruleHasFileAsInput and not exclude:
                targetCandidates.append((buildFile.parent, ruleName))
    return targetCandidates

def main(args):
    if args.verbose:
        print("Running build-mr.py with the following arguments:")
        print(args)
    workspace = pathlib.Path("{}/".format(bazelCmd("info", [ "workspace" ]).rstrip()))

    COMMIT_SHA = args.commit_sha
    if args.verbose:
        print(f"COMMIT_SHA: {COMMIT_SHA}")

    # Find the common ancestor of this commit and main. This is so that when we find files changed
    # in this PR, we find all files, not just the files changed in this specific commit.
    if args.common_ancestor_sha:
        COMMON_ANCESTOR_SHA = args.common_ancestor_sha
    else:
        COMMON_ANCESTOR_SHA = sp.check_output(["git",
                                                "merge-base",
                                                COMMIT_SHA,
                                                "origin/main"]).decode('utf-8').strip()
    if args.verbose:
        print(f"COMMON_ANCESTOR_SHA: {COMMON_ANCESTOR_SHA}")

    # Find the files changed in this PR.
    # git diff-tree --no-commit-id --name-only -r COMMIT_SHA COMMON_ANCESTOR_SHA
    FILES_IN_PR = sp.check_output(["git",
                                   "diff-tree",
                                   "--no-commit-id",
                                   "--name-only",
                                   "--no-renames",
                                   "--diff-filter=AM",
                                   "-r",
                                   COMMON_ANCESTOR_SHA,
                                   COMMIT_SHA]).decode('utf-8').splitlines()

    # In the future, we may want to look at the BUILD file in the common
    # ancestor commit to find rules that contained files which were deleted in
    # this PR.

    if args.verbose:
        print("\nFiles changed in this PR:\n")
        for filePath in FILES_IN_PR:
            print(filePath)

    # This dictionary will hold a mapping of BUILD files to the file paths of the inputs they depend on.
    buildFilesToInputs = {}

    for filePath in FILES_IN_PR:
        # Starting with the filePath directory and walking up to the workspace find
        # a the first file named BUILD or BUILD.bazel
        child = pathlib.Path(filePath)
        parent = child.parent
        buildFile = None
        while not parent.samefile(child) and not parent.samefile(workspace):
            buildFile = parent / "BUILD"
            if buildFile.exists():
                break
            buildFile = parent / "BUILD.bazel"
            if buildFile.exists():
                break
            child = parent
            parent = child.parent
            buildFile = None

        if buildFile:
            prefix = buildFile.parent.as_posix() + '/'
            if filePath.startswith(prefix):
                packageRelativeFilePath = filePath[len(prefix):]
            else:
                packageRelativeFilePath = filePath
            buildFilesToInputs.setdefault(buildFile, []).append(packageRelativeFilePath)

    targets = []

    # Find all targets that have a file in FILES_IN_PR as an input.
    for buildFile, inputs in buildFilesToInputs.items():
        targets += findTargets(
            buildFile,
            inputs,
            ['srcs', 'data', 'hdrs', 'textual_hdrs', 'main', 'inputs'],
        )

    depsTargets = []

    if args.verbose:
        print("\nTargets that have files changed in this PR as inputs:\n")
        for target in targets:
            print("//{}:{}".format(str(target[0]), target[1]))

    # Find all targets that are dependent on the targets we found above.
    # Traverse all non-symlink directories to find BUILD or BUILD.bazel files using pathlib glob.
    for absBuildFile in itertools.chain(workspace.glob('**/BUILD'), workspace.glob('**/BUILD.bazel')):
        buildFile = absBuildFile.relative_to(workspace)
        inputs = []
        for target in targets:
            inputs.append("//{}:{}".format(str(target[0]), target[1]))
            if target[0].samefile(buildFile.parent):
                inputs.append(":" + str(target[1]))
                inputs.append(str(target[1]))

        depsTargets += findTargets(buildFile, inputs, [
            'deps', 'srcs', 'data', 'hdrs', 'textual_hdrs', 'mains', 'inputs'])


    if args.verbose:
        print("\nTargets that depend on the targets above:\n")
        for target in depsTargets:
            print("//{}:{}".format(str(target[0]), target[1]))
        print("")

    # Use bazel cquery to remove any targets that are incompatible with the current
    # platform or tagged as manual.
    allTargets = targets + depsTargets

    # Get a bazel wildcard containing a super-set of all targets. This can be used with cquery to
    # determine if any of allTargets should be skipped due to the configuration.
    allTargetsAllTargets = set(["//{}:all-targets".format(str(target[0])) for target in allTargets])

    extraBazelArgs = []
    for arg in args.bazel_args:
        extraBazelArgs += shlex.split(arg)

    fullTargetGraph = bazelCmd(
        'cquery', extraBazelArgs + [
            '--keep_going',
            '--output=graph',
            '--nograph:factored',
            'set({targets})'.format(targets=' '.join(allTargetsAllTargets)),
        ],
        verbose=args.verbose,
        ignoreErrors = True,
    ).rstrip().split('\n')[2:-1]

    fullTargets = set()
    for line in fullTargetGraph:
        # Add all node lines to fullTargets.
        match = re.search(r'"([^"]*)"(?: -> "([^"]*)")?', line)
        if match:
            nodeName = match.group(1)
            fullTargets.add(nodeName)
    
    for line in fullTargetGraph:
        # In the second pass, remove any node that is not rank-0 from fullTargets.
        match = re.search(r'"([^"]*)"(?: -> "([^"]*)")?', line)
        if match and match.group(2):
            fullTargets.discard(match.group(2))

    configToTargets = dict()

    for node in fullTargets:
        # Split the node into a target and a configuration.
        target, config = re.search(r"^(.+?)\s\((\w+)\)$", node).groups()
        configToTargets.setdefault(config, set()).add(target)

    allCompatibleTargets = set()
    for config, targets in configToTargets.items():
        # For each configuration, filter to targets which are not incompatible with our configuration.
        allCompatibleTargets.update([x for x in bazelCmd(
            'cquery', extraBazelArgs + [
                '--keep_going',
                '--output=starlark',
                '--starlark:expr="" if "IncompatiblePlatformProvider" in providers(target) else target.label',
                'config(set({targets}), {config})'.format(config=config, targets=' '.join(allTargetsAllTargets)),
            ],
            verbose=args.verbose,
            ignoreErrors = True,
        ).rstrip().split('\n') if x])
    
    # These the targets to build & test including any that don't satisfy configuration constraints.
    allTargetsFull = set(["@@//{}:{}".format(str(target[0]), target[1]) for target in allTargets])

    if args.verbose:
        print("\nSkipping the following targets due to an incompatible platform:\n")
        for target in allTargetsFull - allCompatibleTargets:
            print(target)

    # These are the targets to build & test that are compatible with the current platform.
    targetList = [x for x in allTargetsFull if x in allCompatibleTargets]
    targetList.sort()

    if not targetList or targetList.count == 0:
        print("\nNo targets to build.")
        sys.exit()

    print("\nIncluding the following targets:\n")
    for target in targetList:
        print(target)

    # For now only build linux targets. Some of the tests require xvfb and gl libraries which
    # are currently not availble on the linux CI runner.
    bazelBuildType = "build" if platform.system() == 'Linux' else "test"

    bazelArgs = ["bazel", bazelBuildType, "--test_output=errors", "--verbose_failures"]
    bazelArgs.extend(extraBazelArgs)
    bazelArgs.extend(targetList)
    print("\nRunning the following Bazel command:\n")
    print(" ".join(bazelArgs))
    sys.stdout.flush()

    out = sp.run(bazelArgs)
    buildReturnCode = out.returncode
    print(f'buildReturnCode is {buildReturnCode}')

    if buildReturnCode == 4:
        # Ok if there were no tests to run (return code == 4).
        buildReturnCode = 0
    
    sys.exit(buildReturnCode)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Build only the targets related to the files changed in a commit.')
    parser.add_argument('commit_sha', type=str, help='The SHA of the commit to build.')
    parser.add_argument('-v', '--verbose', action='store_true', help='Print additional verbose stdout.')
    parser.add_argument(
        'common_ancestor_sha',
        nargs='?',
        type=str,
        default=None,
        help='The SHA of the common ancestor commit.',
    )
    parser.add_argument(
        '--bazel_args',
        nargs='+',
        default=[],
        help='Additional arguments to pass to bazel.',
    )
    args = parser.parse_args()
    main(args)
