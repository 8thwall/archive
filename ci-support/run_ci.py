#!/usr/bin/env python3
import yaml
import os
import sys
import platform
import tempfile
import argparse
import pathlib

def str_presenter(dumper, data):
    if len(data.splitlines()) > 1:  # check for multiline string
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)
yaml.add_representer(str, str_presenter)

class reference:
    """reference yaml class"""
    def __init__(self, args):
        self.name = args.value[0].value
        self.section = args.value[1].value

def reference_constructor(loader: yaml.SafeLoader, node: yaml.nodes.MappingNode) -> reference:
    """Construct a reference."""
    return reference(node)

def get_loader():
    """Add constructors to PyYAML loader."""
    loader = yaml.SafeLoader
    loader.add_constructor("!reference", reference_constructor)
    return loader


parser = argparse.ArgumentParser()
parser.add_argument('jobs', type=str, nargs='*',
                    help='jobs to run (for now just the first) use --list to get a list')
parser.add_argument('--env', action='append',
                    help='set or override environment variables')
parser.add_argument('--list', action='store_true',
                    help='list the jobs defined in the ci yaml')
parser.add_argument('--show-only', action='store_true',
                    help="only show the script(s) we're going to run")
parser.add_argument('--show-only-yml', action='store_true',
                    help="only show the gitlab yml")
parser.add_argument('--show-env', action='store_true',
                    help="show the environment variables")
parser.add_argument('--manualsign', action='store_true',
                    help="use automatic signing for ios")
parser.add_argument('--gradleupload', action='store_true',
                    help="upload to gradle")
parser.add_argument('--bazel-remote-cache', action='store_true',
                    help="upload to bazel remote cache")
parser.add_argument('--inject', action='append',
                    help="inject changes (string match) into script(s) before (<), after (>) or instead (!) of existing contents")
parser.add_argument('--drop', action='append',
                    help="drop lines matching string")
parser.add_argument('--ci-return', action='store_true',
                    help="output return code 254 to signal that we're running in a CI context")
parser.add_argument('--no-ci-paths', dest='ci_paths', action='store_false', default=True,
                    help="don't use CI paths for Tools")
parser.add_argument('--check-interruptible', action='store_true',
                    help="check whether jobs are flagged as interruptible")
parser.add_argument('--no-unity', action='store_true',
                    help="ignore that we don't have Unity")
parser.add_argument('--debug', action='store_true',
                    help="debugging output")

args = parser.parse_args()
return_code = 0

if not args.list:
    if args.jobs == []:
        print("ERROR: at least one job required to run; use --list to get a list\n")
        parser.print_help()
        sys.exit(1)

if args.debug:
    import pprint
    pp = pprint.PrettyPrinter()

tmp = tempfile.NamedTemporaryFile()
gitlabci_yml = ".gitlab-ci.yml"
dirname = "."
gitlabci = yaml.load(open(gitlabci_yml), Loader=get_loader())
if "include" in gitlabci:
    if isinstance(gitlabci["include"],list):
        for include in gitlabci["include"]:
            if isinstance(include,dict):
                if 'template' in include:
                    continue
                if 'project' in include:
                    continue
                if args.debug: print(include)
                include_yml = os.path.join(dirname, include['local'][1:])
            else:
                if "**" in include:
                    p = pathlib.Path(".")
                    for include_yml in p.glob(include):
                        gitlabci.update(yaml.load(open(include_yml), Loader=get_loader()))
                else:
                    include_yml = os.path.join(dirname, include[1:])
                    gitlabci.update(yaml.load(open(include_yml), Loader=get_loader()))
    else:
        include_yml = os.path.join(dirname, gitlabci["include"][1:])
        gitlabci.update(yaml.load(open(include_yml), Loader=get_loader()))

if args.debug: pp.pprint(gitlabci)

if args.list:
    jobs = []
    for j in gitlabci.keys():
        if j not in ["include", "variables", "stages", "before_script"]:
            if not j.startswith("."):
                interruptible = False
                if args.check_interruptible:
                    if "interruptible" in gitlabci[j]:
                        interruptible = gitlabci[j]["interruptible"]
                    jobs.append(f"{j} {interruptible}")
                else:
                    jobs.append(j)
    print("Available jobs:")
    print("\n".join(['  {0}'.format(j) for j in jobs]))
    sys.exit()

if "variables" in gitlabci:
    for var in gitlabci["variables"]:
        os.environ[var] = str(gitlabci["variables"][var])

if os.environ.get("CI") != "true":
    os.environ["CI_PROJECT_DIR"] = dirname
    os.environ["HOST_ENV"] = "ci"
    if args.ci_paths:
        try:
            xcode_subfolders = [ f.path for f in os.scandir("/opt/niantic/public/xcode") if f.is_dir() ]
            found_xcode = False
            for sf in xcode_subfolders:
                found_xcode = True
                version = sf.split("/")[-1]
                envvar = "XCODE{}_{}".format(version.split(".")[0],version.split(".")[1])
                os.environ[envvar] = f"/opt/niantic/public/xcode/{version}/Xcode-{version}.app"
        except:
            found_xcode = False
        try:
            unity_subfolders = [ f.path for f in os.scandir("/opt/niantic/public/unity") if f.is_dir() ]
            found_unity = False
            for sf in unity_subfolders:
                found_unity = True
                version = sf.split("/")[-1]
                envvar = "UNITY_{}_{}_{}".format(*version.split("."))
                os.environ[envvar] = f"/opt/niantic/public/unity/{version}/Unity.app"
        except:
            found_unity = False
        os.environ["JDK_8u172_ROOT"] = "/Library/Java/JavaVirtualMachines/jdk1.8.0_172.jdk/Contents/Home"
    else:
        os.environ["JDK_8u172_ROOT"] = "/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home"
        os.environ["XCODE11_3"] = "/Applications/Xcode.app"
        os.environ["XCODE12_0"] = "/Applications/Xcode.app"
        os.environ["XCODE12_2"] = "/Applications/Xcode.app"
        found_xcode = True
        try:
            unity_subfolders = [ f.path for f in os.scandir("/Applications/Unity/Hub/Editor") if f.is_dir() ]
            found_unity = False
            for sf in unity_subfolders:
                found_unity = True
                version = sf.split("/")[-1]
                envvar = "UNITY_{}_{}_{}".format(version.split("."))
                os.environ[envvar] = f"/Applications/Unity/Hub/Editor/{version}/Unity.app"
        except:
            found_unity = False
    if not found_xcode and platform.system() == 'Darwin':
        print("we don't seem to have an xcode install")
        sys.exit(1)
    if not found_unity and platform.system() == 'Darwin':
        print("we don't seem to have a unity install")
        if not args.no_unity: sys.exit(1)
if args.inject == None:
    args.inject = []
if args.drop == None:
    args.drop = []
args.drop.append("ci-support/job_commit_override_check.sh")
if args.env != None:
    for env in args.env:
        var_name = env.split("=")[0]
        var_value = "=".join(env.split("=")[1:])
        os.environ[var_name] = var_value

if args.show_env:
    for env in os.environ:
        print(f"{env} = {os.environ[env]}")

script = []
for job_arg in args.jobs:
    try:
        if job_arg not in gitlabci:
            print("unknown job must be one of:")
            print(gitlabci.keys())
            sys.exit(1)
    except:
        print("no job provided. available jobs:")
        for job in set(gitlabci.keys()) - set(['include', 'variables', 'stages']):
            print("  {}".format(job))
        sys.exit(1)
    if "extends" in gitlabci[job_arg]:
        extends = []
        if isinstance(gitlabci[job_arg]["extends"],list):
            if args.debug:
                print(f"multiple extends in {job_arg}")
                print(gitlabci[job_arg]["extends"])
            extends = gitlabci[job_arg]["extends"]
        else:
            extends = [gitlabci[gitlabci[job_arg]["extends"]]]
        for extend in extends:
            if args.debug: print(f"EXTEND:\n{extend} {type(extend)}")
            if "before_script" in extend:
                for line in extend["before_script"]:
                    script.append(line)
            if "script" in extend:
                for line in extend["script"]:
                    script.append(line)
            print("multiple extends")
        if "before_script" in gitlabci[gitlabci[job_arg]["extends"]]:
            for line in gitlabci[gitlabci[job_arg]["extends"]]["before_script"]:
                script.append(line)
        if "script" in gitlabci[gitlabci[job_arg]["extends"]]:
            for line in gitlabci[gitlabci[job_arg]["extends"]]["script"]:
                script.append(line)
    else:
        if "before_script" in gitlabci:
            for line in gitlabci["before_script"]:
                script.append(line)
    if "variables" in gitlabci[job_arg]:
        for var in gitlabci[job_arg]["variables"]:
            os.environ[var] = str(gitlabci[job_arg]["variables"][var])
    if "script" in gitlabci[job_arg]:
        for line in gitlabci[job_arg]["script"]:
            if isinstance(line,reference):
                for refline in gitlabci[line.name][line.section]:
                    script.append(refline)
                continue
            script.append(line)
    if args.show_only_yml:
        print(yaml.dump({job_arg:gitlabci[job_arg]}, default_flow_style=False, sort_keys=False))
        continue
    with open(tmp.name, 'w') as f:
        for line in script:
            if not args.manualsign:
                line = line.replace("--manual-signing", "")
            if not args.gradleupload:
                if "uploadCIBuildArtifact" in line:
                    continue
            if not args.bazel_remote_cache:
                # line = line.replace("--remote_upload_local_results=true", "")
                # line = line.replace("--google_credentials=${GOOGLE_APPLICATION_CREDENTIALS}", "")
                line = line.replace("--config=ci", "--config=run_ci")
            if args.inject != None:
                for injection in args.inject:
                    if "<" in injection: # before
                        key,content = injection.split("<")
                        line = line.replace(key.strip(), (content + " " + key).strip())
                    elif ">" in injection: # after
                        key,content = injection.split(">")
                        line = line.replace(key.strip(), (key + " " + content).strip())
                    elif "!" in injection: # replace
                        key,content = injection.split("!")
                        line = line.replace(key.strip(), content.strip())
                    else:
                        print(f"invalid injection missing direction indicator (<,>,!): {injection}")
                        sys.exit(1)
            if args.drop != None:
                cont = False
                for drop in args.drop:
                    if "\n" in line.strip():
                        subcont = False
                        newlines = []
                        sublines = line.strip().split("\n")
                        for subline in sublines:
                            if drop not in subline:
                                newlines.append(subline)
                        line = "\n".join(newlines)
                    if drop in line:
                        cont = True
                if cont:
                    continue
            f.write(line+"\n")
    os.system("cat {} | perl -pe 's#^#>> #g'".format(tmp.name))
    if not args.show_only and not args.show_only_yml:
        return_code = os.WEXITSTATUS(os.system("bash -x {}".format(tmp.name)))
    if args.debug: print(f"RETURN: {return_code}")
if args.ci_return:
    sys.exit(254)
else:
    sys.exit(return_code)
