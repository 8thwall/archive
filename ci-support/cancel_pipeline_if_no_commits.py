#!/usr/bin/env python3

import argparse
import gitlab
import os
import sys

def str2bool(v):
    if v == "":
        # default
        return False
    if isinstance(v, bool):
        return v
    if v.lower() in ('true', 't', 'y', 'yes', '1'):
        return True
    elif v.lower() in ('false', 'f', 'n', 'no', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

def main():
    parser = argparse.ArgumentParser(description='Cancel this CI pipeline if there were no commits since the last scheduled pipeline.')

    parser.add_argument('--branch', type=str, default="main",
                        help="specify reference project branch if different from 'main'")
    parser.add_argument('project', type=str,
                        help='namespace/project name to scan for recent scheduled runs and commits')
    parser.add_argument('pipelineid', type=str,
                        help='pipeline id of current pipeline run')

    args = parser.parse_args()
    print(args)

    gl = gitlab.Gitlab('https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com', private_token=os.environ['BUILD_API_TOKEN'])
    project = gl.projects.get(args.project, retry_transient_errors=True)

    pipelines = project.pipelines.list(source='schedule', ref=args.branch, sort="desc", get_all=False)
    # Assumes *this* pipeline run is the most recent run.
    if len(pipelines) < 2:
        print('No previously scheduled pipelines were found on project/branch specified.')
        return
    print("Expecting *this* pipeline run:")
    print(pipelines[0])
    prev_scheduled_pipeline = pipelines[1]
    print("Previous scheduled pipeline:")
    print(prev_scheduled_pipeline)
    commits = project.commits.list(ref=args.branch, sort="desc", get_all=False, since=prev_scheduled_pipeline.created_at)

    print(str(len(commits)) + " commits occurred since the previous scheduled pipeline began.")
    if len(commits) > 0:
        print("Most recent commit:")
        print(commits[0])
        print("Scheduled CI Pipeline will not cancel.")
    elif len(commits) == 0 and args.pipelineid != "":
        print("Canceling *this* pipeline (ID: " + args.pipelineid + ") since there were no commits since the last pipeline run...")
        current_pipeline = project.pipelines.get(args.pipelineid)
        current_pipeline.cancel()
    return

if __name__ == "__main__":
    main()
