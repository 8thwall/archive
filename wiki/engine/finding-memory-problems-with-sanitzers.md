# Finding memory problems with sanitizers

# Overview

When you run into memory leak or other memory related issues, it is a good idea to see if the sanitizers have any suggestions on where the issue might lie.

# How to find memory issue if you know where it occurs

This applies when you are debugging the engine on the web or perhaps you added some code recently and you know which binary/library is the issue.

To turn on sanitizers, you want to set the same sanitizer for both compile and link flag.

Add the following to your `cc_binary` in your BUILD file:

```
copts = [
    "-fsanitize=undefined",
],
linkopts = [
    "-fsanitize=undefined",
],
```

If you are using this in WebAssembly, then add the following to your `jsasm_binary` (BUILD file):

```
opts = [
    "-fsanitize=undefined",
],
```

There are two options: undefined (UBSAN) or address (ASAN) which allows you to catch different problems. See more info on emscripten [page](<https://emscripten.org/docs/debugging/Sanitizers.html>).

For asan, you might have to increase the `TOTAL_MEMORY` in emopts to 300mb

### End Results

Once turned on, you will see error messages similar to this one in the console.

# How to find memory issue when you don't know where it occurs

You can run your binary/unit test with ASAN and it will fail and show where you have a memory issue. It's best that you create/update unit test to start failing with ASAN and fix it. This will make sure that mistakes are found in the future.

Here are the aliases that you can use within your shell:
```bash
alias bbsan="bazel build -c dbg --copt=-fsanitize=address --linkopt=-fsanitize=address"
alias btsan="bt -c dbg --copt=-fsanitize=address --linkopt=-fsanitize=address"
alias brsan="bazel run --linkopt=-fsanitize=address --copt=-fsanitize=address"
```

Then you can run your unit test with:
```bash
btsan //c8/pixels:pixels-transform
```
