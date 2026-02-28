import argparse
import json
import os
import re

import gitlab
import requests
import slack_sdk

import gitlab.v4.objects.pipelines as Pipelines
import gitlab.v4.objects.projects as projects

# TODO(lreyna): Make these configurable
DEFAULT_GITLAB_PROJECT = 'repo/niantic'
DEFAULT_BRANCH = 'main'
DEFAULT_COMMIT_PATTERN = r"\[xrapi\]|\[nae\]|\[dom\]|\[ecs\]|\[headless-gl\]"

def parse_args():
    parser = argparse.ArgumentParser(description='Post NAE Build Information to Slack')
    parser.add_argument(
        '--pipeline-name',
        action='store',
        required=True,
        help='Name of the Scheduled Pipeline',
    )
    parser.add_argument( # TODO(lreyna): Use the slack_sdk instead of the webhook
        '--webhook-url',
        action='store',
        required=True,
        help='Webhook URL for Slack',
    )
    parser.add_argument(
        '--build-prefix',
        action='store',
        required=True,
        help='The type of build that is being triggered',
    )
    parser.add_argument(
        '--nae-trigger',
        action='store',
        required=True,
        help='The pipeline that triggered the NAE build',
    )
    parser.add_argument(
        '--version-name',
        action='store',
        required=True,
        help='The version name of the build',
    )
    parser.add_argument(
        '--artifact-url',
        action='store',
        required=True,
        help='Web URL for the build artifacts',
    )
    parser.add_argument(
        '--app-display-name',
        action='store',
        required=True,
        help='The display name of the application',
    )
    parser.add_argument( # TODO(lreyna): Split up this logic for setting up message body and posting
        '--extra-info',
        action='store',
        required=False,
        help='Extra Information to Append to Message String',
    )

    args = parser.parse_args()
    return args

def get_latest_commits(args: argparse.Namespace):

    def setup_gitlab():
        gl = gitlab.Gitlab(os.environ['CI_SERVER_URL'], private_token=os.environ['NIANTIC_GITLAB_TOKEN'])
        gl.auth()

        return gl
    
    def get_scheduled_pipeline(schedule_name: str, project: projects.Project) -> Pipelines.ProjectPipelineSchedule:
        sched_pipelines = project.pipelineschedules.list(get_all=True)

        target_sched: Pipelines.ProjectPipelineSchedule = None
        for sched_pipe in sched_pipelines:
            if sched_pipe.attributes["description"] == schedule_name:
                target_sched = sched_pipe
                break

        if target_sched is None:
            logger.error("Could not find Scheduled Pipeline!")
            exit(1)

        return target_sched
    
    def get_latest_pipelines_from_schedule(schedule: Pipelines.ProjectPipelineSchedule, num_pipelines: int = 2) -> Pipelines.ProjectPipeline:
        # NOTE(lreyna): For some reason the 'desc' order is not working as expected.
        # Getting all piplines for now and sorting them manually.
        pipelines = schedule.pipelines.list(get_all=True)
        return pipelines[-num_pipelines:]

    gl = setup_gitlab()
    project = gl.projects.get(DEFAULT_GITLAB_PROJECT)
    scheduled_pipeline = get_scheduled_pipeline(args.pipeline_name, project)
    pipelines = get_latest_pipelines_from_schedule(scheduled_pipeline)

    print(f"Acquired most recent pipelines:\n{pipelines}")
    if (len(pipelines) < 2):
        print("Not enough pipelines to compare commits!")
        return []
    
    latest_pipeline = pipelines[0]
    previous_pipeline = pipelines[1]

    commits = project.commits.list(
        ref_name=DEFAULT_BRANCH,
        since=latest_pipeline.created_at,
        until=previous_pipeline.created_at
    )

    # Log commits in the Gitlab Console
    print(f"Commits between {latest_pipeline.created_at} and {previous_pipeline.created_at}:")
    for commit in commits:
        print(f"{commit.id}: {commit.title}")
    
    return commits

def filter_commits(commits, commit_pattern):
    filtered_commits = []
    for commit in commits:
        if re.search(commit_pattern, commit.title):
            filtered_commits.append(commit)
    
    return filtered_commits

def set_up_message_body(args: argparse.Namespace, commits):
    message_body = f"*{args.app_display_name} {args.build_prefix} {args.nae_trigger} Build - {args.version_name}*\n"
    message_body += f"Artifacts: {args.artifact_url}"

    if len(commits) > 0:
        message_body += "\n\nCommits:\n"
        for commit in commits:
            commit_url = f"{os.environ['CI_SERVER_URL']}/{DEFAULT_GITLAB_PROJECT}/-/commit/{commit.id}"
            message_body += f"<{commit_url}|{commit.title}>\n"

    if len(args.extra_info) > 0:
        message_body += f"\n\n{args.extra_info}"

    return message_body

def post_message(webhook_url, message_body):
    print(f"Sending the following message to Slack:\n{message_body}")
    payload = {
        'text': message_body,
    }

    response = requests.post(
        webhook_url, data=json.dumps(payload),
        headers={'Content-Type': 'application/json'}
    )

def main():
    args = parse_args()

    commits = get_latest_commits(args)
    filtered_commits = filter_commits(commits, DEFAULT_COMMIT_PATTERN)

    message_body = set_up_message_body(args, filtered_commits)

    post_message(args.webhook_url, message_body)

if __name__ == "__main__":
    main()
