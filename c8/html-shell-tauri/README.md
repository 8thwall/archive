# html-shell-tauri
This holds a Tauri app which we build into a shell for use in NAE.

## Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

Since we use a monorepo with no top-level `Cargo.toml`, the `rust-analyzer` extension will not work automatically.
To set up `rust-analyzer` for `html-shell-tauri`, add the following to your active `.vscode/settings.json`:

```json
"rust-analyzer.linkedProjects": [
  "${workspaceFolder}/rust-project.json"
],
"rust-analyzer.cargo.buildScripts.enable": true,
"rust-analyzer.procMacro.enable": true,
"rust-analyzer.check.command": "clippy",
"rust-analyzer.check.extraArgs": ["--", "-D", "warnings"]
```

You will have to run the `@rules_rust//tools/rust_analyzer:gen_rust_project` target to generate the
`rust-project.json` file.

It's recommended to build the main Tauri binary before generating the `rust-project.json` file, so
all of the external dependencies will exist when the json is generated.

```
bazel build //c8/html-shell-tauri:main

bazel run @rules_rust//tools/rust_analyzer:gen_rust_project -- //bzl/examples/... //c8/html-shell-tauri/...
```

You should re-generate the `rust-project.json` when there are changes to the rust project, so your intellisense will be up to date with the latest dependencies.

## Updating Cargo Dependencies
If you make changes to `Cargo.toml`, you must update the lock files before building.

Setting the CARGO_BAZEL_REPIN to true when running a bazel command (that uses a rust rule), will
repin the `Cargo.toml`.

WARNING: This takes several minutes to complete
```
CARGO_BAZEL_REPIN=true bazel build //c8/html-shell-tauri:main
```
