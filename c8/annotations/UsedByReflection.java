package com.the8thwall.c8.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * Annotates an element to signify that it is referenced through reflection. This is
 * useful when determining what should not be stripped of obfuscated by ProGuard.
 */
@Target({ElementType.CONSTRUCTOR, ElementType.FIELD, ElementType.METHOD, ElementType.TYPE})
public @interface UsedByReflection {

  /**
   * @return the value describing the class / file using this element through reflection
   */
  String value();
}
