package com.the8thwall.c8.exceptions;

import com.the8thwall.c8.annotations.DoNotStrip;

/**
 * The exception that is thrown when an invalid mobile app key has been provided by the developer.
 */
@DoNotStrip
public class IllegalMobileAppKeyException extends RuntimeException {

  public IllegalMobileAppKeyException() { super(); }

  public IllegalMobileAppKeyException(String message) { super(message); }
}
