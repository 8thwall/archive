# Using VSCode at 8th Wall

# Why VSCode

We use C++ and JS/Typescript, VSCode is the best free editor that handles multiple languages

# Setup

Download and install vscode using their recommended method

Since we use Bazel which outputs lots of file changes into their sandbox folder, you want to tell VSCode to ignore watching these files so their intellisense engine doesn't go crazy indexing files as you bazel build code changes.

Your code8 workspace comes with `.vscode` folder which contains `settings.json` file with sensible defaults already. Your computer should auto-exclude bazel files in the sandbox.

# Hot Keys

Cmd + Shift + K, Open Preferences Keyboard Shortcut (JSON)

Add the following:
```json
[
 {"key": "ctrl+`", "command": "workbench.action.terminal.focus"},
 {"key": "ctrl+`", "command": "workbench.action.focusActiveEditorGroup", "when": "terminalFocus"}
]
```

Then you can use ctrl-backtick to switch between the built-in terminal and your active editor.

# Ignore circular dependencies

We reference code in other parts of monorepo from some parts of monorepo. These symlinks will greatly slow down text search and file search. Make sure to ignore them in your `.vscode/settings.json` file that you put in your checked out monorepo.
```json
{
 "search.exclude": {
 "**/node_modules": true,
 "**/bower_components": true,
 "**/*.code-search": true,
 "reality/cloud/aws/cloudformation/**/lambdas/shared": true,
 "reality/cloud/aws/cloudformation/email-notifications/src/xrhome": true,
 "apps/client/public/web/dev8/src/shared": true,
 "bazel-niantic": true,
 "bazel-bin": true,
 "bazel-out": true,
 },
 "files.exclude": {
 "**/.git": true,
 "**/.svn": true,
 "**/.hg": true,
 "**/CVS": true,
 "**/.DS_Store": true,
 "**/Thumbs.db": true,
 "reality/cloud/aws/cloudformation/**/lambdas/shared": true,
 "reality/cloud/aws/cloudformation/email-notifications/src/xrhome": true,
 "apps/client/public/web/dev8/src/shared": true,
 "bazel-niantic": true,
 "bazel-bin": true,
 "bazel-out": true,
 }
}
```

# Tips and Tricks

Add custom labels to open files to quickly tell which file belong to which directory. This is useful when you have many files with the same name open at the same time.

Add the following to your `settings.json` to delineate between `index.*` and `app.*` files.
```json
"workbench.editor.customLabels.patterns": {
 "**/src/index.*": "${dirname(1)} - ${filename}.${extname}",
 "**/index.*": "${dirname} - ${filename}.${extname}",
 "**/src/app.*": "${dirname(1)} - ${filename}.${extname}",
 "**/app.*": "${dirname} - ${filename}.${extname}",
}
```

# Snippets

## C++

Cmd-Shift-P, Configure User Snippets, cpp

```json
{
  "C8Log": {
    "prefix": "C8Log",
    "body": [
      "C8Log(\"[$TM_FILENAME_BASE] $1\", $2);",
      "$0"
    ],
    "description": "C8Log"
  },
  "C8Log for loop": {
    "prefix": "for",
    "body": [
      "for (int i = 0; i < ${0:array}.size(); ++i) {",
      "\tC8Log(\"[$TM_FILENAME_BASE] %s\", ${0:array}[i].toString().c_str());",
      "}"
    ],
    "description": "C8Log for loop"
  },
  "C8Log BIG loop": {
    "prefix": "for",
    "body": [
      "for (int i = 0; i < ${1:array1}.size(); ++i) {",
      "\tC8Log(\"[$TM_FILENAME_BASE] ${1:array1} %s ${2:array2} %s\",",
      "\t\t${1:array1}[i].toString().c_str(),",
      "\t\t${2:array2}[i].toString().c_str()",
      "\t);",
      "}"
    ],
    "description": "C8Log BIG loop"
  }
}
```

# Extensions

We **HIGHLY** recommend the following extensions

 * C/C++ by Microsoft (ms-vscode.cpptools)

 * ~~vscode-bazel by The Bazel Team (bazelbuild.vscode-bazel)~~

 * It seems possible that the bazel extension increases build times, so don’t install it

 * `<REMOVED_BEFORE_OPEN_SOURCING>` (Slack thread)

 * inliner8 by 8thwall (8thwall.inliner8) <https://marketplace.visualstudio.com/items?itemName=8thWall.inliner8>

 * Clang-format by xaver (xaver.clang-format)

 * Shader languages by slevesque (slevesque.shader)

 * vscode-capnp by xmonader (xmonader.vscode-capnp)

 * ESLint by Dirk Baeumer (dbaeumer.vscode-eslint)

 * Code Spell Checker by Streetside Software (streetsidesoftware.code-spell-checker)

If you vim as well,

 * Vim by vscodevim (vscodevim.vim)

# Debugging Node Tests and Executables

If you are not using bazel, feel free to use the normal tooling. If you have a `js_cli` or `js_test` bazel target, your setup is a bit more involved.

## Debug with auto attach (recommended)

This is the fastest workflow. You run your bazel command in VSCode special “JavaScript Debug Terminal” which will automatically attach a debugger on a node run.

You will need to specify some extra configs for this auto-attach. Edit your `settings.json` (Cmd+P: Preferences: Open User Settings (JSON)), then set this field
```json
"debug.javascript.terminalOptions": {
 "sourceMapPathOverrides": {
 "webpack:///./*": "${workspaceFolder}/*",
 },
 "resolveSourceMapLocations": [
 "/private/var/tmp/_bazel_datchu/**",
 "${workspaceFolder}/**",
 "!**/node_modules/**"
 ],
},
```

Make sure to change the bazel sandbox to YOUR username. i.e. `_bazel_datchu` should be `_bazel_${yourUserName}`.

Now, you can run your test/cli with the inspect mode. Node won’t wait for you to attach but vscode will attach fast enough that your breakpoints will work. The inspect mode is referring to the flag `--inspect=yes` in your command. Here is an example:
```bash
bazel run //c8/dom:webgl-conformance-tests --angle --inspect=yes
```

## Debug with auto break

This approach will break at the first line of the code while waiting for you to attach your debugger. For example, let’s say you want to debug the example ts unit test. You will use our `inspect-brk` feature like this.
```bash
bazel run //bzl/examples:hello-ts-test --inspect=brk --test_output=all
```

You can now use the Attach run configuration below to attach to this running process.
```json
{
 "name": "Attach",
 "port": 9229,
 "request": "attach",
 "sourceMapPathOverrides": {
 "webpack:///./*": "${workspaceFolder}/*",
 },
 "resolveSourceMapLocations": [
 "/private/var/tmp/_bazel_datchu/**",
 "${workspaceFolder}/**",
 "!**/node_modules/**"
 ],
 "type": "node",
 "trace": true,
},
```

Note that you need to change my sandbox’s path to your sandbox path. The sandbox path is generally `/private/var/tmp/_bazel_${YOUR_USER_NAME}`. We need to tell vscode to find source map file in the sandbox. This is because your sources are in your workspace but all bazel build outputs are in the sandbox.

Files are symbolically linked into the sandbox so you might run into a weird case where breakpoints in the ts files are encountered, then sometimes the output js file breakpoints are encountered.

# Debugging C++

This is a crude example for debugging in vscode, and I'd like it to be replaced with something better like vscode-bazel targets or more fancy.

Since we symbolicate even our optimized build, you can still gleam information from a build that is fast.

## Debugging Fix March 2021

I put this info up here since over the past few months something broke somewhere that results in the below instructions not working. This is my setup and how I got it working (the sections below are for additional details)

Install CodeLLDB <https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb>

Example launch _(notice type is lldb instead of cppdbg; some property names are different and I didn’t see obvious natvis support after a cursory glance)_ :
Adjust for your particular case.

Corresponding task:

And c_cpp_properties.json config has the following entry

## When to use the debug build

 * You have not been able to solve the problem in the optimized build and willing to spend more time building/running for now.

 * You encounter segfault that you have no clue why. Running a debug build will stop the debugger on a segfault.

 * You want to know every variable value. opt build might remove variables and you get the message `no location, value may have been optimized out` during debugging

## Debugging an optimized build

This example debugs the command line call to `g8 diff`.

Create or update `.vscode/tasks.json` to add a build task.
```json
{
 "version": "2.0.0",
 "tasks": [
 {
 "label": "Build Example",
 "type": "shell",
 "command": "bazel build //apps/client/g8:g8",
 "group": {
 "kind": "build",
 "isDefault": true
 },
 }
 ]
 }
```

Create or update `.vscode/launch.json` to add a launch target.
```json
{
 "version": "0.2.0",
 "configurations": [
 {
 "name": "(lldb) Launch",
 "type": "cppdbg",
 "request": "launch",
 "preLaunchTask": "Build Example",
 "program": "${workspaceFolder}/bazel-out/darwin-opt/bin/apps/client/g8/g8",
 "args": ["diff"],
 "stopAtEntry": false,
 "cwd": "${workspaceFolder}",
 "environment": [],
 "externalConsole": false,
 "MIMode": "lldb"
 }
 ]
}
```

Then start a debugging session in vscode by clicking the debug pane and the green arrow.

## Debugging a debug build

Create or update `.vscode/tasks.json` to add a build task.
```json
{
 "version": "2.0.0",
 "tasks": [
 {
 "label": "Build apps/client/internalqa/omniscope/imgui/omniscope",
 "type": "shell",
 "command": "bazel build -c dbg //apps/client/internalqa/omniscope/imgui:omniscope",
 "group": {
 "kind": "build",
 "isDefault": true
 },
 }
 ]
 }
```

Create or update `.vscode/launch.json` to add a launch target.
```json
{
 "version": "0.2.0",
 "configurations": [
 {
 "name": "(lldb) imgui:omniscope",
 "type": "cppdbg",
 "request": "launch",
 "preLaunchTask": "Build apps/client/internalqa/omniscope/imgui/omniscope",
 "program": "${workspaceFolder}/bazel-out/darwin_arm64-dbg/bin/apps/client/internalqa/omniscope/imgui/omniscope",
 "args": [],
 "stopAtEntry": false,
 "cwd": "${workspaceFolder}",
 "environment": [],
 "externalConsole": false,
 "MIMode": "lldb",
 "sourceFileMap": {
 "niantic" : "${workspaceFolder}"
 }
 }
 ]
}
```

Note:

 * You need to change the sourceFileMap section to reflect your path (_bazel_YourUserName/….)

 * Historically, cppdbg will work and then not work after a while, check with other team members if this doesn’t work for you.

## Debug a unit test

This example debugs the unit test at _reality/engine/imagedetection:detection-image-loader-test_.

Create or update `.vscode/tasks.json` to add a build task.
```json
{
 "version": "2.0.0",
 "tasks": [
 {
 "label": "Build reality/engine/imagedetection/detection-image-loader-test",
 "type": "shell",
 "command": "bazel build -c dbg //reality/engine/imagedetection:detection-image-loader-test",
 "group": {
 "kind": "build",
 "isDefault": true
 },
 },
 ]
 }
```

Create or update `.vscode/launch.json` to add a launch target.
```json
{
 "version": "0.2.0",
 "configurations": [
 {
 "name": "(lldb) detection-image-loader-test",
 "type": "cppdbg",
 "request": "launch",
 "preLaunchTask": "Build reality/engine/imagedetection/detection-image-loader-test",
 "program": "${workspaceFolder}/bazel-out/darwin-dbg/bin/reality/engine/imagedetection/detection-image-loader-test",
 "args": [
 ],
 "stopAtEntry": false,
 "cwd": "${workspaceFolder}",
 "environment": [],
 "externalConsole": false,
 "MIMode": "lldb",
 "sourceFileMap": {
 "niantic": "${workspaceFolder}"
 }
 }
 ]
}
```

If you're still not able to see the symbols, try running `bazel clean`.

## Improved variable display in debug mode

Currently, natvis implementation in vscode with clang MI is VERY slow. It takes more than 30 seconds to show a 500-items vector of `HPoint3`. We should revisit this at a later time.

We have a natvis file available in our code for now while vscode gets faster in this department.

To launch your debugger with this natvis do add `visualizerFile` and `showDisplayString` property to your launch config. Here is an example launch config with these properties set.
```json
{
 "version": "0.2.0",
 "configurations": [
 {
 "name": "(lldb) Launch",
 "type": "cppdbg",
 "request": "launch",
 "preLaunchTask": "Build Example",
 "program": "${workspaceFolder}/bazel-out/darwin-dbg/bin/apps/client/g8/g8",
 "args": ["diff"],
 "stopAtEntry": false,
 "cwd": "${workspaceFolder}",
 "environment": [],
 "externalConsole": false,
 "MIMode": "lldb",
 "visualizerFile": "${workspaceFolder}/c8.natvis",
 "showDisplayString": true
 }
 ]
}
```

## Improved file resolution

When you set breakpoints, you may notice that the files that are opened are not the same files you're working with. If you want to change file resolution, you can map between the built files and their original source. You will add something like this to your launch config, substituting `dba729e604a09d9c62052df799e28ca4` with the path to your files (you'll see it the first time you run without this config applied):
```json
"sourceFileMap": {
 "/var/tmp/_bazel_paris/dba729e604a09d9c62052df799e28ca4/execroot/code8/" : "${workspaceFolder}/",
}
```

## VSCode Debugging is running slowly?

Hide the variables tab in the debugger. It's querying all the variables in local and global scope. This can be extremely slow if you're dealing with images. Just right-click on one of the left panels in the debugger view and uncheck "Variables".

![](/eng/debugging-g8/variables_tab.png)

This way, you can simply lazy load any of the variables you're curious about by typing in its name in the Debug Console

## C++ Settings

Bazel uses sandboxes which means that IntelliSense needs some extra help finding generated headers and third party deps. You're going to want to build your target to ensure that bazel pulls in deps and generates things like capnp headers.

Example `.vscode/c_cpp_properties` file contains the following things:
```json
{
 "configurations": [
 {
 "name": "Mac",
 "includePath": [
 "${workspaceFolder}/**",
 ],
 "defines": [],
 "macFrameworkPath": [],
 "compilerPath": "/usr/bin/clang",
 "cStandard": "c11",
 "cppStandard": "c++17",
 "intelliSenseMode": "clang-x64",
 "browse": {
 "limitSymbolsToIncludedHeaders": true,
 "path": [
 "${workspaceRoot}/apps/",
 "${workspaceRoot}/bzl/",
 "${workspaceRoot}/c8/",
 "${workspaceRoot}/codelabs/",
 "${workspaceRoot}/coverage/",
 "${workspaceRoot}/hooks/",
 "${workspaceRoot}/reality/",
 "${workspaceRoot}/scripts/",
 "${workspaceRoot}/third_party/"
 ]
 }
 }
 ],
 "version": 4
}
```

## Clang-format

This is not directly VSCode related, but is still useful. To set up aliases to make it easier to `clang-format` files, add this to your `.zshrc` or `.bashrc` file:
```bash
alias cfm="git diff --name-only | egrep '\.h$|\.cc$' | xargs -I {} clang-format -i {}"
alias cf="clang-format -i"
```
