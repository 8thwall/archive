#!/bin/bash

# Upload selected dataset folders to HuggingFace. First run:
# - brew install huggingface-cli
# - hf auth login 
#   - Use a token with write permissions to the 8th Wall HuggingFace organization: https://huggingface.co/8thWall
# Then run ./reality/quality/datasets/upload_to_hf.sh

REPO="8thWall/datasets"
DATASETS_DIR="$HOME/datasets"

# Specify which folders to upload
FOLDERS=(
    # benchmark
    # face
    # low-motion
    # portals
    # selfies
    # xzsliding
    # compression
    # flat-image-targets
    # maps
    # problematic
    # stability
    # yawpitchroll
    # cylindrical-image-targets
    # hand-tracking
    # newfeatures
    # relocalization
    # true-scale
    # depth-mapping
    # loop-close
    # offset
    # scan-targets
    # vps
)

for folder in "${FOLDERS[@]}"; do
    folder_path="$DATASETS_DIR/$folder"

    if [ ! -d "$folder_path" ]; then
        echo "ERROR: Folder '$folder' does not exist in $DATASETS_DIR"
        continue
    fi

    echo "=========================================="
    echo "Uploading: $folder"
    echo "=========================================="

    hf upload "$REPO" "$folder_path" "$folder" --repo-type=dataset --exclude "*.DS_Store"

    if [ $? -eq 0 ]; then
        echo "SUCCESS: $folder uploaded"
    else
        echo "FAILED: $folder upload failed"
    fi
    echo ""
done

echo "Done!"
