import sys
import xml.etree.ElementTree as ET
# parsing directly.
tree = ET.parse(sys.argv[1])
root = tree.getroot()
for so in root.iter('system-out'):
    so.text = ""
tree.write(sys.argv[1])

