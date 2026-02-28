#!/bin/sh
echo "Executing ci-support/generate_ci_bazel_rc_downloader_config.sh"
generate_ci_bazelrc_downloader_config_start_time=`date +%s`

echo "Generating ci-support/ci_gen.bazel-artifactory-mirrors-config with the following parameters:"
echo ">>> ARTIFACTORY_NIANTIC_TEAM_PUBLICBOT=$ARTIFACTORY_NIANTIC_TEAM_PUBLICBOT"

cat << EOF > ci-support/ci_gen.bazel-artifactory-mirrors-config
rewrite maven.google.com/(.*) $ARTIFACTORY_NIANTIC_TEAM_PUBLICBOT@artifactory.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>/artifactory/public-maven_google_com/\$1
rewrite mirror.bazel.build/(.*) $ARTIFACTORY_NIANTIC_TEAM_PUBLICBOT@artifactory.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>/artifactory/public-mirror-bazel-build-remote/\$1

EOF

echo "Generating ci-support/ci_gen.bazelrc with the following parameters:"
echo ">>> always --experimental_downloader_config=ci-support/ci_gen.bazel-artifactory-mirrors-config"

cat << EOF > ci-support/ci_gen.bazel-downloader.bazelrc
always --experimental_downloader_config=ci-support/ci_gen.bazel-artifactory-mirrors-config

EOF

echo "Completed ci-support/generate_ci_bazel_rc_downloader_config.sh in $((`date +%s`-generate_ci_bazelrc_downloader_config_start_time)) seconds"
