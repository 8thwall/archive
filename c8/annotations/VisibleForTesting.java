package com.the8thwall.c8.annotations;

/**
 * Annotates an element to signify that its scope's visibility is wider than it should be so it can
 * be tested.
 * This annotation exists within the Android Support library and the Guava library, but using a
 * custom annotation prevents us from adding a dependency to either of these librarys for this.
 */
public @interface VisibleForTesting {
}
