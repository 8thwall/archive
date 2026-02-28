# Releasing ECS + dev8

## Context

We push a versioned runtime, dev8, ECS definitions, and metadata.json to CDN so they can be updated by us and fetched by users. Small MRs that require `c8/ecs` changes as well as `xrhome` changes should be written such that ECS can be safely released first, and the changes in xrhome are gated behind a feature flag. Once the ECS release goes out, with the corresponding feature flag, projects with runtime versions that have that feature enabled will see the feature. It is the responsibility of the implementer of the feature to add the feature flag.

## 1. Setup

- Make sure you have admin console access
- Post in [#8w-studio-discuss](<REMOVED_BEFORE_OPEN_SOURCING>) that you're creating a new build for a runtime release with the commits being picked (or if you are rolling up for a minor/major release).

## 2. Build

Go to the [runtime commit list](https://ac.8thwall.com/runtime-commits). Either pick the commits for the release or click force push to do a rollup to the ecs-release branch. This will update the [ecs-release branch](http://jenkins.8thwall.com:8080/job/ecs-release/) to include all the commits that are on the [main branch](https://github.com/8thwall/code8/commits/main/).

At this point, Jenkins will automatically start a new build. When it is completed, go the [runtime build list](https://ac.8thwall.com/runtime-releases/new) where the build should be have an entry.

## 3. Announce

Open the [changelog doc](<REMOVED_BEFORE_OPEN_SOURCING>). Click the copy manifest button on the build in the runtime builds list and paste the manifest and paste above the table to provide the manifest for internal users to use the prerelease. Check out the [changelog board](<REMOVED_BEFORE_OPEN_SOURCING>) and add a list of jira release notes items that will be release as part of this version. If you have additional context or want to look at commit history to make proposals for changelog entries for what you just pushed, you are free to do so, but it is not your sole responsibility. More info at [Studio: Changelog Process](<REMOVED_BEFORE_OPEN_SOURCING>).

Post the message in the #beta-niantic-studio thread with a link to the updated [changelog](<REMOVED_BEFORE_OPEN_SOURCING>) so that internal users can test it.

## 4. QA

Go through the test cases at [go/ECSQA](<REMOVED_BEFORE_OPEN_SOURCING>) by making a copy of the template and verifying each scenario behaves as expected.

Once everything looks good, post in the thread that you plan to release version x.x.x. We release
- a MAJOR version when you make incompatible API changes
- a MINOR version when you add functionality in a backward compatible manner
- a PATCH version when you make backward compatible bug fixes

More info at https://semver.org/

## 5. Release

On AC, select the build from the builds list, and select which level we are bumping, and the version target (if necessary for a backport). Click Publish New Version x.x.x. Verify that the release succeeded by checking it exists at https://ac.8thwall.com/runtime-releases.

Post a message to [#8w-release-active](<REMOVED_BEFORE_OPEN_SOURCING>) saying that runtime version x.x.x was released. Verify the version is selectable by going to any studio project, set allow updates to 'none', and making sure the published version exists in the dropdown. Check out the [changelog board](<REMOVED_BEFORE_OPEN_SOURCING>) and ping those who are assigned pending entries.

## 1.x.x Releases

If the planned release is for the 1.x.x track, update the old URL using prod8 also
  1. `cd ~/repo/prod8`
  2. `g8 newchange ecs-release`
  3. `rm -rf cdn/web/ecs/release/`
  4. `g8 newchange -m "[cdn] Upload ECS 1.x.x"`
  5. `aws s3 cp --recursive s3://<REMOVED_BEFORE_OPEN_SOURCING>/web/ecs/build/<build-prefix-from-manifest> cdn/web/ecs/release/`
  6. `find cdn/web/ecs/release -type f | xargs -n 1 gunzip --suffix '' -f` if the files are gzipped
  7. `rm cdn/web/ecs/release/metadata.json`
  8. `g8 update`
  9. Get approval
  10. Land

# Scene Graph JSDoc Comments
Add helpful JSDoc comments to scene graph types to improve Studio Agent's tool calling capabilities.
We use `ts-to-zod` to generate Zod schemas from `scene-graph.ts` and parse JSDoc comments into Zod
descriptions. The generated Zod schemas with their descriptions supercharge Studio Agent's ability
to understand the scene graph. Tool calling improvements net the highest ROI compared to any other
agent capability investments.

`ts-to-zod` supports several JSDoc tags out of the box: https://github.com/fabien0102/ts-to-zod#other-jsdoc-tags.
The most important one for us being `@description`. Add JSDoc tags top level to describe the overall
type and nested to describe individual properties.

```typescript
/**
 * @description This is an overall description of SomeType.
 */
type SomeType = {
  /**
   * @description This is a property description of someProperty.
   */
  someProperty: string
}

// The generated Zod schema
const someTypeSchema = z.object({
  someProperty: z.string().describe('This is a property description of someProperty.'),
}).describe('This is an overall description of SomeType.')

```

> [!TIP]
> `@schema` without a leading `.` will override the generated schema.

For example, we use `@schema` to override the generated schema for tuples because tuples are not
supported by `zod-to-json-schema`

```typescript
/**
 * @schema array(z.number()).length(6).describe('Used to represent shadow camera frustum bounds: left, right, top, bottom, near, far.')
 */
type Vec6Tuple = [number, number, number, number, number, number]

// The generated Zod schema
const vec6TupleSchema = z.array(z.number())
  .length(6)
  .describe('Used to represent shadow camera frustum bounds: left, right, top, bottom, near, far.')
```
