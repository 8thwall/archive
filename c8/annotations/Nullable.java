package com.the8thwall.c8.annotations;

/**
 * Annotates an element to signify that it can possibly be null.
 * This annotation exists within the Android Support library, but using a custom annotation
 * prevents us from adding a dependency to this library.
 */
public @interface Nullable {}
