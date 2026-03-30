# Public API

The API hosted on api.8thwall.com.

Consumed by end users as well as xrhome, currently just for managing image targets.

https://www.8thwall.com/docs/api/platform-api/

## Deploying

### Internal pushes

`bazel run //reality/cloud/aws/lambda/public-api:deploy-latest` to push to lambda. This allows for running test events.

`bazel run //reality/cloud/aws/lambda/public-api:deploy-qa` to push to QA, used by www-cd.qa.8thwall.com - currently the `masterDev` alias

`bazel run //reality/cloud/aws/lambda/public-api:deploy-rc` to push to RC (release candidate), used by www-rc.8thwall.com - currently the `master` alias

### Production

To deploy to production, assuming RC is looking good, go to the [aliases page](https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions/public-api?tab=aliases), note down the current version used by `master`, and modify the `prod` alias to have the same version.


 