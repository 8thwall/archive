# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

# Usage: python3 printRGB <filename> <x> <y>
import sys
from PIL import Image

RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
NOCOLOR = '\033[0m'

im = Image.open(sys.argv[1]) #Can be many different formats.

print ("Filename: " + YELLOW + sys.argv[1] + NOCOLOR)
print ("\nImage Info: " + str(im.info))

pix = im.load()
print ("\nImage Size: " + str(im.size)) #Get the width and hight of the image for iterating over

x = int(sys.argv[2])
y = int(sys.argv[3])

print ("\nRGB Value at Coordinate" + YELLOW +" (" + str(x) + ", " + str(y) + ")"+ NOCOLOR + " is:")
print ( "(" + 
    RED + 
    str(im.getpixel((x,y))[0]) +
    NOCOLOR + ", " +
    GREEN + 
    str(im.getpixel((x,y))[1]) +
    NOCOLOR + ", " +
    BLUE + 
    str(im.getpixel((x,y))[2]) +
    NOCOLOR + ") \n"
    )
