# InlinerJS

Easily update BUILD files based on imports


## Usage

```bash
bazel run --run_under="cd $PWD && " //apps/client/inlinerjs -- path/to/file.ts
```

You can also pass the BUILD file like so:

```bash
bazel run --run_under="cd $PWD && " //apps/client/inlinerjs -- path/to/BUILD
```

All typescript files in the folder will be synced into the BUILD file.

Adding `--no-new` will only update rules that are already present.

TBD: VSCode integration

## Configuration

Out of the box, `inlinerjs` generates a `js_library` rule for each file, with each import as a `dep`.

The following heuristics are applied:

1. `import` statements in the file become `deps` if they resolve to a file that exists within the repo.
1. Rules ending in `-test` will default to `js_test` rather than `js_library`.
1. `@nia/reality/engine/api/mesh.capnp` maps to `//reality/engine/api:mesh.capnp-ts`.

```typescript
// build-args.ts
import type {BackendInfo} from './backend/backend-info'
import type {FunctionWebpackConfigName} from './backend/function-config-name'
import type {AppInfo, PwaInfo} from './db-types'
```

Automatically generates:

```python
js_library(
    name = "build-args",
    srcs = [
        "build-args.ts",
    ],
    deps = [
        "//reality/cloud/aws/lambda/studio-deploy:db-types",
        "//reality/cloud/aws/lambda/studio-deploy/backend:backend-info",
        "//reality/cloud/aws/lambda/studio-deploy/backend:function-config-name",
    ],
)
```

When more configuration is needed, use the following:

| Format | Description | |
| ------- | ----------- | -- |
| `// @name(my-name)` | Override `name = "..."` in the BUILD file | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/972c353a3e7a55c102668120b9e4d45440a73d8c/reality/cloud/imageprocessor/main.ts#L2)
| `// @rule(js_binary)` | Override the rule used | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/972c353a3e7a55c102668120b9e4d45440a73d8c/reality/app/xr/js/tools/blob-a-script.ts#L1)
| `// @attr(polyfill = "none")` | Specify additional attributes | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/d38374223570a17b7e9980c0336873c3075157de/reality/cloud/aws/lambda/public-api/test/common.ts#L1)
| `// @attr[](data = "file.png")` | Specify additional attributes as an array | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/d38374223570a17b7e9980c0336873c3075157de/reality/cloud/aws/lambda/public-api/test/images.ts#L2-6)
| `// @dep(//bzl/examples/hello-js)` | Specify dependencies that are not inferred automatically | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/972c353a3e7a55c102668120b9e4d45440a73d8c/reality/app/xr/js/src/face-controller.ts#L5)
| `// @inliner-skip-next` | Ignore the import on the following line | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/c38a3fbe03fd1d7e9fedf63230de72677d961121/reality/cloud/aws/lambda/studio-api/query.ts#L5)
| `// @inliner-off` | Disable `inlinerjs` for this file | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/972c353a3e7a55c102668120b9e4d45440a73d8c/reality/app/xr/js/index.ts#L4)
| `// @package(npm-lambda)` | Shorthand for `npm_rule = "@npm-lambda//:npm-lambda"` | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/45c09ff8d65882af9787ddadabd8ddbe22b84544/bzl/examples/js/import/cli-on-top.ts#L2)
| `// @visibility(//visibility:public)` | Override visibility | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/d38374223570a17b7e9980c0336873c3075157de/c8/ecs/src/runtime/math/algorithms.ts#L1) / [Alternative](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/d6a60910819098e378518ce40a12d33d23b0d2ca/reality/cloud/aws/lambda/studio-deploy/BUILD#L7)
| `// @sublibrary(:example-lib)` | Mark the library as a sublibrary | [Example](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/9b23acee0b74c024f857cca8abed2df3996364fb/c8/dom/audio/audio-param.ts#L1)

## Gotchas

1. `require('')` syntax is not supported.
1. Passing a BUILD file path on the command line does not inline .js files, since `require('')` is not supported.
1. When changing the type of build (e.x. `js_library` -> `js_binary`), the old config remains in the BUILD file and must be deleted manually.
1. When defining a rule other than `js_library`, the import must be added manually.

## Dealing with circular dependencies

If type definitions are the issue, factor out the types into separate file.

You can also combine all the circularly dependent logic into one file.

For really tricky cases, you can group the files into one `js_library` with multiple `srcs`, which looks like [this](https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/repo/<REMOVED_BEFORE_OPEN_SOURCING>/-/blob/f21acc4f8d13b2f921754cc0551b870be8e230e9/c8/dom/BUILD#L52).

Then you can add `// @sublibrary(:my-lib)` to each of the files which will transitively include that grouped `js_library`, allowing any consumer to import any member of the group, but resolve to the full set regardless.

An example would look like:

```
js_library(
    name = "circular-lib",
    srcs = [
        "circular-dep-1.ts",
        "circular-dep-2.ts",
    ],
)

js_library(
    name = "circular-dep-1",
    deps = [
        ":circular-lib",
    ],
)

js_library(
    name = "circular-dep-2",
    deps = [
        ":circular-lib",
    ],
)
```
