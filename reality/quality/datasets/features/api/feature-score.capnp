@0x8fa541d49c3091f2;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("c8");

using Java = import "/capnp/java.capnp";
$Java.package("com.the8thwall.reality.datasets.features");
$Java.outerClassname("FeatureScore");  # Must match this file's name!

struct Patch77 {
  pixels77 @0: Data;
}

struct FeatureScoreExample {
  target @0: Patch77;
  candidates @1: List(Patch77);
}

struct CrossFeatureScoreExample {
  crossFeatures @0: List(FeatureScoreExample);
}

struct CrossFeatureScoreExamples {
  examples @0: List(CrossFeatureScoreExample);
}

struct CrossFeatureScoreTrainingSet {
  training @0: CrossFeatureScoreExamples;
  test @1: List(CrossFeatureScoreExamples);
  validation @2: List(CrossFeatureScoreExamples);
}
