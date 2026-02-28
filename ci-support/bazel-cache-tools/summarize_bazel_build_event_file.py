#!/usr/bin/env python3
#
# Helper file to parse and summarize a Bazel build event text file. How to run:
# - First build a Bazel target with:
#   - bazel build --build_event_text_file=/tmp/build_event_text_file.txt //bzl/examples/proto/api:hello-cc
# - Then run this script with:
#   - cd ~/repo/niantic && python3 ./ci-support/bazel-cache-tools/summarize_bazel_build_event_file.py --file /tmp/build_event_text_file.txt
#
# To interpret this data see this code:
# - https://bazel.build/docs/bep-glossary
# - https://github.com/bazelbuild/bazel/blob/master/src/main/java/com/google/devtools/build/lib/buildeventstream/proto/build_event_stream.proto

import sys
import argparse
import pprint
import textwrap
from typing import List

pp = pprint.PrettyPrinter()

def duration_str(duration_millis: int) -> str:
  duration_secs = duration_millis / 1000
  duration_mins = duration_secs / 60

  duration_millis = str(duration_millis).ljust(7)
  duration_secs = str(duration_secs.__round__(2)).ljust(7)
  duration_mins = str(duration_mins.__round__(2)).ljust(3)
  return f'Took {duration_millis} millis / {duration_secs} secs / {duration_mins} mins.'

def size_str(size_bytes: int) -> str:
  if size_bytes == None:
    return "None"

  def format(val: int, width: int) -> str:
      return str(val.__round__(2)).ljust(width)
  return f'{format(size_bytes, 12)} bytes / {format(size_bytes / 1024, 12)} kb / {format(size_bytes / 1024 / 1024, 8)} mb / {format(size_bytes / 1024 / 1024 / 1024, 5)} gb.'

class ActionData(object):
  mnemonic: str = None
  actions_executed: int = None
  first_started_ms: int = None
  last_ended_ms: int = None

  def duration_str(self) -> str:
    duration_millis = self.last_ended_ms - self.first_started_ms
    return f'{self.mnemonic.ljust(28)} executed {str(self.actions_executed).ljust(4)} action(s). {duration_str(duration_millis)}'

  def __repr__(self):
    return str(self.__dict__)

class RunnerCount(object):
  name: str = None
  count: int = None

  def str(self) -> str:
    return f'{(self.name + ":").ljust(17)} {self.count}'

  def __repr__(self):
    return str(self.__dict__)

class GarbageMetric(object):
  type: str = None
  garbage_collected_bytes: int = None

  def str(self) -> str:
    return f'Type: {(self.type + ".").ljust(18)} Collected: {size_str(self.garbage_collected_bytes)}'

  def __repr__(self):
    return str(self.__dict__)

class TimingMetrics(object):
  cpu_time_in_ms: int = None
  wall_time_in_ms: int = None
  analysis_phase_time_in_ms: int = None

  def __repr__(self):
    return str(self.__dict__)

class Artifact(object):
  size_in_bytes: int = None
  count: int = None

  def str(self,) -> str:
    return f'Count: {(str(self.count) + ".").ljust(6)} Size: {size_str(self.size_in_bytes)}'

  def __repr__(self):
    return str(self.__dict__)

class ArtifactMetrics(object):
  output_artifacts_from_action_cache: int = None
  source_artifacts_read: Artifact = Artifact()
  output_artifacts_seen: Artifact = Artifact()
  top_level_artifacts: Artifact = Artifact()

  def __repr__(self):
    return str(self.__dict__)

class BuildGraphMetrics(object):
  action_lookup_value_count: int = None
  action_lookup_value_count_not_including_aspects: int = None
  action_count: int = None
  action_count_not_including_aspects: int = None

  input_file_configured_target_count: int = None
  output_file_configured_target_count: int = None
  other_configured_target_count: int = None

  output_artifact_count: int = None

  post_invocation_skyframe_node_count: int = None

  def str(self) -> str:
    return ''


class Event(object):
  build_host: str = None
  build_user: str = None
  platform_name: str = None
  cpu: str = None
  target_cpu: str = None
  configured_targets: List[str] = []

  actions_created: int = None
  actions_executed: int = None
  actions_created_not_including_aspects: int = None
  action_data: List[ActionData] = []
  runner_count: List[RunnerCount] = []
  garbage_metrics: List[GarbageMetric] = []
  timing_metrics: TimingMetrics = TimingMetrics()
  artifact_metrics: ArtifactMetrics = ArtifactMetrics()
  build_graph_metrics: BuildGraphMetrics = BuildGraphMetrics()

  def print(self):
    print('build_host:                           ', self.build_host)
    print('build_user:                           ', self.build_user)
    print('platform_name:                        ', self.platform_name)
    print('cpu:                                  ', self.cpu)
    print('target_cpu:                           ', self.target_cpu)
    print('configured_targets:                   ', self.configured_targets)
    print()

    print('actions_created:                      ', self.actions_created)
    print('actions_created_not_including_aspects:', self.actions_created_not_including_aspects)
    print('actions_executed:                     ', self.actions_executed)
    print()

    print('action_data:')
    for d in self.action_data:
      print(' ', d.duration_str())
    print()

    print('runner_count:')
    for r in self.runner_count:
      print(' ', r.str())
    print()

    print('garbage_metrics:')
    for r in self.garbage_metrics:
      print(' ', r.str())
    print()

    print('timing_metrics:')
    print('  CPU Time:       ' + duration_str(self.timing_metrics.cpu_time_in_ms))
    print('  Wall Time:      ' + duration_str(self.timing_metrics.wall_time_in_ms))
    print('  Analysis Phase: ' + duration_str(self.timing_metrics.analysis_phase_time_in_ms))
    print()

    print('artifact_metrics:')
    print('  output_artifacts_from_action_cache:', self.artifact_metrics.output_artifacts_from_action_cache)
    if self.artifact_metrics.output_artifacts_from_action_cache != None:
        if self.artifact_metrics.source_artifacts_read != None:
            print('  source_artifacts_read:', self.artifact_metrics.source_artifacts_read.str())
        if self.artifact_metrics.output_artifacts_seen != None:
            print('  output_artifacts_seen:', self.artifact_metrics.output_artifacts_seen.str())
        if self.artifact_metrics.top_level_artifacts != None:
            print('  top_level_artifacts:  ',self.artifact_metrics.top_level_artifacts.str())
    print()

    print('build_graph_metrics: ')
    print('  action_lookup_value_count:                      ', self.build_graph_metrics.action_lookup_value_count)
    print('  action_lookup_value_count_not_including_aspects:', self.build_graph_metrics.action_lookup_value_count_not_including_aspects)
    print('  action_count:                                   ', self.build_graph_metrics.action_count)
    print('  action_count_not_including_aspects:             ', self.build_graph_metrics.action_count_not_including_aspects)
    print()
    print('  input_file_configured_target_count:             ', self.build_graph_metrics.input_file_configured_target_count)
    print('  output_file_configured_target_count:            ', self.build_graph_metrics.output_file_configured_target_count)
    print('  other_configured_target_count:                  ', self.build_graph_metrics.other_configured_target_count)
    print()
    print('  output_artifact_count:                          ', self.build_graph_metrics.output_artifact_count)
    print()
    print('  post_invocation_skyframe_node_count:            ', self.build_graph_metrics.post_invocation_skyframe_node_count)

  def __repr__(self):
    return str(self.__dict__)

def has(string: str, token: str) -> bool:
  return string.find(token) >= 0

def val(line: str, delimiter: str) -> str:
  return line.split(delimiter)[1].strip('" \'')

def intVal(line: str, delimiter: str) -> str:
  return int(val(line, delimiter))

parser = argparse.ArgumentParser()
parser.epilog = textwrap.dedent('''\
Helper file to parse and summarize a Bazel build event text file. How to run:
- First build a Bazel target with:
  - bazel build --build_event_text_file=$(pwd)/build_event_text_file.txt //bzl/examples/proto/api:hello-cc
- Then run this script with:
  - python3 summarize_bazel_build_event_file.py --file $(pwd)/build_event_text_file.txt
''')
parser.add_argument('--file', type=str, nargs='*',
                    help='input file to parse')
args = parser.parse_args()
return_code = 0
if not args.file:
  print("ERROR: File required. Use --file to pass in a file.\n")
  parser.print_help()
  sys.exit(1)


e = Event()
with open(args.file[0], 'rb') as f:
  previous_line: str = None
  previous_previous_line: str = None

  action_data: ActionData = None
  runner_count: RunnerCount = None
  garbage_metric: GarbageMetric = None
  timing_metrics: TimingMetrics = None
  artifact_metrics: ArtifactMetrics = None
  build_graph_metrics: BuildGraphMetrics = None
  for line in f.readlines():
    line = str(line.strip())

    # General misc information.
    if line.__contains__("value:") and previous_line.__contains__("key: \"BUILD_HOST\""):
      e.build_host = val(line, "value: ")
    if line.__contains__("value:") and previous_line.__contains__("key: \"BUILD_USER\""):
      e.build_user = val(line, "value: ")
    if line.__contains__("platform_name:"):
      e.platform_name = val(line, "platform_name:")
    if line.__contains__("cpu:"):
      e.cpu = val(line, "cpu:")
    if line.__contains__("label:") and previous_line.__contains__("target_configured"):
      e.configured_targets.append(val(line, "label: "))

    # Top-level actions.
    if line.__contains__("actions_created:"):
      e.actions_created = intVal(line, "actions_created:")
    if line.__contains__("actions_created_not_including_aspects:"):
      e.actions_created_not_including_aspects = intVal(line, "actions_created_not_including_aspects:")
    if line.__contains__("actions_executed:") and not previous_line.__contains__('mnemonic'):
      e.actions_executed = intVal(line, "actions_executed:")

    # Action data (action_data).
    if line.__contains__("action_data {"):
      action_data = ActionData()
    if line.__contains__("mnemonic: ") and previous_line.__contains__('action_data {'):
      action_data.mnemonic = val(line, "mnemonic:")
    if line.__contains__("actions_executed:") and previous_line.__contains__('mnemonic'):
      action_data.actions_executed = intVal(line, "actions_executed:")
    if line.__contains__("first_started_ms:"):
      action_data.first_started_ms = intVal(line, "first_started_ms:")
    if line.__contains__("last_ended_ms:"):
      action_data.last_ended_ms = intVal(line, "last_ended_ms:")
      e.action_data.append(action_data)
      action_data = None

    # Runner count (runner_count).
    if line.__contains__("runner_count {"):
      runner_count = RunnerCount()
    if line.__contains__("name:") and previous_line.__contains__('runner_count {'):
      runner_count.name = val(line, "name:")
    if line.__contains__("count:") and previous_line.__contains__('name:'):
      runner_count.count = intVal(line, "count:")
      e.runner_count.append(runner_count)
      runner_count = None

    # Garbage Metrics (garbage_metrics).
    if line.__contains__("garbage_metrics {"):
      garbage_metric = GarbageMetric()
    if line.__contains__("type:") and previous_line.__contains__("garbage_metrics {"):
      garbage_metric.type = val(line, "type:")
    if line.__contains__("garbage_collected:") and previous_previous_line.__contains__("garbage_metrics {"):
      garbage_metric.garbage_collected_bytes = intVal(line, "garbage_collected:")
      e.garbage_metrics.append(garbage_metric)

    # Timing Metrics (timing_metrics).
    if line.__contains__("cpu_time_in_ms:"):
      e.timing_metrics.cpu_time_in_ms = intVal(line, "cpu_time_in_ms:")
    if line.__contains__("wall_time_in_ms:"):
      e.timing_metrics.wall_time_in_ms = intVal(line, "wall_time_in_ms:")
    if line.__contains__("analysis_phase_time_in_ms:"):
      e.timing_metrics.analysis_phase_time_in_ms = intVal(line, "analysis_phase_time_in_ms:")

    # Artifact Metrics (artifact_metrics).
    if line.__contains__("count:") and previous_line.__contains__("output_artifacts_from_action_cache"):
      e.artifact_metrics.output_artifacts_from_action_cache = intVal(line, "count:")
    if line.__contains__("size_in_bytes:"):
      value = intVal(line, "size_in_bytes:")
      if previous_line.__contains__("source_artifacts_read"):
        e.artifact_metrics.source_artifacts_read.size_in_bytes = value
      elif previous_line.__contains__("output_artifacts_seen"):
        e.artifact_metrics.output_artifacts_seen.size_in_bytes = value
      elif previous_line.__contains__("top_level_artifacts"):
        e.artifact_metrics.top_level_artifacts.size_in_bytes = value
    if line.__contains__("count:"):
      value = intVal(line, "count:")
      if previous_previous_line.__contains__("source_artifacts_read"):
        e.artifact_metrics.source_artifacts_read.count = value
      elif previous_previous_line.__contains__("output_artifacts_seen"):
        e.artifact_metrics.output_artifacts_seen.count = value
      elif previous_previous_line.__contains__("top_level_artifacts"):
        e.artifact_metrics.top_level_artifacts.count = value

    # Build Graph Metrics (build_graph_metrics).
    if line.__contains__("action_lookup_value_count:"):
      e.build_graph_metrics.action_lookup_value_count = intVal(line, "action_lookup_value_count:")
    if line.__contains__("action_count:"):
      e.build_graph_metrics.action_count = intVal(line, "action_count:")
    if line.__contains__("output_artifact_count:"):
      e.build_graph_metrics.output_artifact_count = intVal(line, "output_artifact_count:")
    if line.__contains__("post_invocation_skyframe_node_count:"):
      e.build_graph_metrics.post_invocation_skyframe_node_count = intVal(line, "post_invocation_skyframe_node_count:")
    if line.__contains__("action_lookup_value_count_not_including_aspects:"):
      e.build_graph_metrics.action_lookup_value_count_not_including_aspects = intVal(line, "action_lookup_value_count_not_including_aspects:")
    if line.__contains__("action_count_not_including_aspects:"):
      e.build_graph_metrics.action_count_not_including_aspects = intVal(line, "action_count_not_including_aspects:")
    if line.__contains__("input_file_configured_target_count:"):
      e.build_graph_metrics.input_file_configured_target_count = intVal(line, "input_file_configured_target_count:")
    if line.__contains__("output_file_configured_target_count:"):
      e.build_graph_metrics.output_file_configured_target_count = intVal(line, "output_file_configured_target_count:")
    if line.__contains__("other_configured_target_count:"):
      e.build_graph_metrics.other_configured_target_count = intVal(line, "other_configured_target_count:")

    previous_previous_line = previous_line
    previous_line = line


e.print()
print('\nDone')

# DEBUGGING
# if line.find("actions_created:") >= 0:
#         e.actions_created = intVal(line, "actions_created:")

# EVENT_INTS = [
#   'actions_created:',
#   'actions_executed:',
#   'actions_created_not_including_aspects:'
# ]
# for event_int in EVENT_INTS:
#       if line.find(event_int) >= 0:
#         e[event_int.strip(':')] = intVal(line, event_int)[1
