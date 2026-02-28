PREFIX=$1

aws s3 ls "s3://<REMOVED_BEFORE_OPEN_SOURCING>/$PREFIX/" --recursive | \
  sed "s|^.* $PREFIX/|/|g" | \
  sed "s|/index.html$||g" | \
  grep -E -v "^/page-data/" | \
  grep -E -v "^\s*$"
echo "/page-data/*"
echo "/"
