package com.the8thwall.c8.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * Annotates an element to signify that it should not be stripped or obfuscated by ProGuard.
 * Some useful usages would be on Android {@link Activity} or {@link Service} classes, as those
 * class names must match what is declared in the AndroidManifest.xml file.
 */
@Target({ElementType.CONSTRUCTOR, ElementType.FIELD, ElementType.METHOD, ElementType.TYPE})
public @interface DoNotStrip {}
