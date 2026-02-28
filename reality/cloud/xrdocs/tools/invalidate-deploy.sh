#!/usr/bin/env bash

PROD_DIST="E2QT8W89PO0POQ"
STAG_DIST="EL2PHJ1TSQYV0"
if [ "$1" == "prod" ]; then
    DISTRIBUTION_ID=$PROD_DIST
else
    DISTRIBUTION_ID=$STAG_DIST
fi

#Invalidate the CloudFront Distribution
invalidation_id=$(aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/docs/*" "/docs/" --query Invalidation.Id)
length=${#invalidation_id}

echo "invalidation $invalidation_id created to invalidating distribution with id: $DISTRIBUTION_ID"
# Wait for invalidation to finish
aws cloudfront wait invalidation-completed --distribution-id $DISTRIBUTION_ID --id ${invalidation_id:1:$length-2}
