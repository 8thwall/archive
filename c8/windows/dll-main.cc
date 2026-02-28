#include <stdio.h>
#include <windows.h>
#include "c8/symbol-visibility.h"

extern "C" {
C8_PUBLIC int getMagicNumber() { return 42; }
C8_PUBLIC int getSecondMagicNumber() { return 24; }
}
