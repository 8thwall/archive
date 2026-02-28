"""Command-line tool to list files in a unitypackage."""

__author__ = 'Erik Murphy-Chutorian'
__email__ = 'mc@8thwall.com'

import sys
import os
import os.path
import tempfile
import tarfile

GZ_MAGIC_BYTES = b"\x1f\x8b\x08"

def validateFile(path):
  """Validate files are available and gzip."""
  if not os.path.isfile(path):
    raise ValueError('File not found: [%s]' % path)
  with open(path, 'rb') as f:
    header = f.read(len(GZ_MAGIC_BYTES))
    if not header.startswith(GZ_MAGIC_BYTES):
      raise ValueError('Not a valid .unitypackage (gzip) file: [%s]' % path)


def listPackageFiles(path):
  with tempfile.TemporaryDirectory() as tmpDir:
    filesInfo = {}
    pathnameFilesToExtract = []
    with tarfile.open(path) as tar:
      for tarInfo in tar.getmembers():
        fileName = os.path.basename(tarInfo.name)
        hashName = os.path.basename(os.path.dirname(tarInfo.name))
        if len(hashName) != 32:
          continue
        hashDict = filesInfo.setdefault(hashName, {})
        if fileName=='asset.meta':
          hashDict['hasMeta'] = True
        if fileName=='asset':
          hashDict['hasAsset'] = True
        if fileName=='pathname':
          pathnameFilesToExtract.append(tarInfo)

      tar.extractall(path=tmpDir, members=pathnameFilesToExtract)

      fileList = []
      for hashDir, packageInfo in filesInfo.items():
        filePath = open(os.path.join(tmpDir, hashDir, 'pathname')).read()
        if 'hasMeta' in packageInfo:
          fileList.append(filePath + '.meta')
        if 'hasAsset' in packageInfo:
          fileList.append(filePath)

      fileList.sort()
      print('\n'.join(fileList))


def main(argv):
  """List files in a unitypackage."""
  if len(argv) <= 1:
    print("Usage: unitypackage-ls [PATH]...")
    return

  # Validate the files are present and gzip format.
  for path in argv[1:]:
    validateFile(path)

  # List the files (not directories) in the unitypackage.
  for path in argv[1:]:
    listPackageFiles(path)


if __name__ == '__main__':
  main(sys.argv)
