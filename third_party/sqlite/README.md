# SQLite 3 Build File Patch (For Gazelle)

This patch is used to add sqlite as c++ library, to be used with gazelle.
This patch does NOT work on windows or android build systems, as we would need
the @platform dependency also added to gazelle sandbox, which in itself
is another can of worms.

Taken from https://github.com/bazelbuild/bazel-central-registry/pull/2132/files
For non go libraries, one should use the `bazel_dep` from central registry.
This is meant to be used as a cgo transitive dependency.