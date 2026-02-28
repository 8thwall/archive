"""
This module configures the markdown2confluence tool for the project by downlading a pre-compiled version
"""

def _markdown2confluence_tool_impl_2(repository_ctx):

  os_name = repository_ctx.os.name.lower()
  os_arch = repository_ctx.os.arch.lower()

  confluence_username = repository_ctx.getenv("CONFLUENCE_USERNAME")
  confluence_password = repository_ctx.getenv("CONFLUENCE_PASSWORD")
  confluence_endpoint = repository_ctx.getenv("CONFLUENCE_ENDPOINT")

  if os_name == "macos" or os_name == "mac os x":
    os_name = "darwin"
  elif os_name.find("windows") != -1:
    os_name = "windows"
  elif os_name.find("linux") != -1:
    os_name = "linux"
  else:
    os_name = "unknown"

  if os_arch == "aarch64" or os_arch == "arm64":
    os_arch = "arm64"

  if os_arch == "amd64":
    os_arch = "x86_64"

  file_name_to_download = "go-markdown2confluence_{}_{}_{}.tar.gz".format(
    repository_ctx.attr.version,
    os_name,
    os_arch,
  )

  # Download checksums
  repository_ctx.download(
    url = "https://github.com/justmiles/go-markdown2confluence/releases/download/v{}/checksums.txt".format(repository_ctx.attr.version),
    output = "checksums.txt",
  )

  # Grep checksums from checksums.txt
  checksum = repository_ctx.execute(["grep", file_name_to_download, "checksums.txt"], quiet = True).stdout.strip().split(" ")[0]

  markdown2confluence_supported = ":host_supported"
  
  if os_name == "unknown" or \
    checksum == None or \
    confluence_username == None or \
    confluence_password == None or \
    confluence_endpoint == None or \
    checksum == "" or \
    confluence_password == "" or \
    confluence_username == "" or \
    confluence_endpoint == "":
    print("WARNING: Markdown2confluence tool is not supported on this host: ensure that the environment variables CONFLUENCE_USERNAME, CONFLUENCE_PASSWORD, and CONFLUENCE_ENDPOINT are set and that the host OS is supported by https://github.com/justmiles/go-markdown2confluence")
    markdown2confluence_supported = ":host_not_supported"

  if markdown2confluence_supported == ":host_supported":

    # Download the tool
    url_to_download = "https://github.com/justmiles/go-markdown2confluence/releases/download/v{}/{}".format(
      repository_ctx.attr.version,
      file_name_to_download,
    )

    repository_ctx.download_and_extract(
      url = url_to_download,
      sha256 = checksum,
    )

  # Generate BUILD file with constraints
# Generate BUILD file with constraints
  repository_ctx.file(        
    "BUILD.bazel",
    """

constraint_setting(
    name = "markdown2confluence_available",
    default_constraint_value = "{markdown2confluence_supported}",
)

constraint_value(
    name = "host_supported",
    constraint_setting = ":markdown2confluence_available",   
    visibility = ["//visibility:public"],
)

constraint_value(
    name = "host_not_supported",
    constraint_setting = ":markdown2confluence_available",
    visibility = ["//visibility:public"],
)

filegroup(
    name = "markdown2confluence_toolset",
    srcs = [":markdown2confluence_wrapper.sh"] + glob(["markdown2confluence"]),
    visibility = ["//visibility:public"],
)

    """.format(markdown2confluence_supported = markdown2confluence_supported),
    executable = False,
  )

  repository_ctx.file(
    "markdown2confluence_wrapper.sh",
    """
#!/bin/bash

# This script is a wrapper for the markdown2confluence tool
# It sets the environment variables for the confluence user and password
# and then calls the markdown2confluence tool

export CONFLUENCE_USERNAME={confluence_username}
export CONFLUENCE_PASSWORD={confluence_password}
export CONFLUENCE_ENDPOINT={confluence_endpoint}

markdown2confluence_dir=$(cd "$(dirname "${{BASH_SOURCE[0]}}")" &> /dev/null && pwd)

"${{markdown2confluence_dir}}/markdown2confluence" -d "$@"
    """.format(
      confluence_username = confluence_username,
      confluence_password = confluence_password,
      confluence_endpoint = confluence_endpoint,
    ),
    executable = True,
  )

markdown2confluence_tool = repository_rule(
    implementation = _markdown2confluence_tool_impl_2,
    attrs = {
      "version": attr.string(default = "3.4.6"),
    },
    doc = "A repository rule that downloads the markdown2confluence tool", 
)
