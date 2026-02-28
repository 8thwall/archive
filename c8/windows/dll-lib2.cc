#include <windows.h>

#include "c8/symbol-visibility.h"

extern "C" {
C8_PUBLIC float getANormalNumber() { return 3.1415; }
}
