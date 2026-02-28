### What
This directory holds the NAE Packager.

### Releasing NAE Packager
To release the NAE Packager, do the following:
1. Build and upload the NAE Packager to S3.
  - Switch to a clean client
  - Use `git log` to get the current commit hash
  - `bazel run //reality/cloud/xrreleases:nae-releasetool -- --overrideReleaseVersion=<commit>-apple-silicon-host`
2. Manually kick off the Data Sync job for both the `qa` and `prod` data realms:
  - `qa`: https://us-west-2.console.aws.amazon.com/datasync/home?region=us-west-2#/tasks/task-<REMOVED_BEFORE_OPEN_SOURCING>
  - `prod`: https://us-west-2.console.aws.amazon.com/datasync/home?region=us-west-2#/tasks/task-<REMOVED_BEFORE_OPEN_SOURCING>
3. Test your new NAE Packager version in xrhome.
  - You can do this without updating the NAE CDK stack (i.e. the Lambda) by setting the field in `` to `<commit>-apple-silicon-host`, and then building.
4. Update `reality/cloud/aws/cdk/nae-lambda-builder/src/lambda/nae-builder/index.ts` with `const NAE_VERSION = '<commit>-apple-silicon-host'`.
5. Post in #release-active to let people know you are going to update the NAE Packager `qa` version.
  - Example: <REMOVED_BEFORE_OPEN_SOURCING>
6. Deploy the NAE CDK `qa` stack:
  - `~/repo/code8/reality/cloud/aws/cdk/nae-lambda-builder npx cdk deploy nae-lambda-builder-qa`
7. Test again in xrhome - use https://www-cd.qa.8thwall.com and do not set an override shell version.
8. Create a PR with your changes to `reality/cloud/aws/cdk/nae-lambda-builder/src/lambda/nae-builder/index.ts`.
  - Example: https://github.com/8thwall/code8/pull/2034
9. After the PR is approved and merged, post in #release-active to let people know you are going to update the NAE Packager `prod` version.
  - Example: <REMOVED_BEFORE_OPEN_SOURCING>
10. Deploy the NAE CDK `prod` stack.
  - `~/repo/code8/reality/cloud/aws/cdk/nae-lambda-builder npx cdk deploy nae-lambda-builder-prod`
11. Test again in xrhome - use https://8thwall.com.
