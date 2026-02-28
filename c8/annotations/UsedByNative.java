package com.the8thwall.c8.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * Annotates an element to signify that it is referenced by a native (C/C++) file. This is
 * useful when determining what should not be stripped of obfuscated by ProGuard.
 */
@Target({ElementType.CONSTRUCTOR, ElementType.FIELD, ElementType.METHOD, ElementType.TYPE})
public @interface UsedByNative {

  /**
   * @return the value describing the class / file using this element natively
   */
  String value();
}
