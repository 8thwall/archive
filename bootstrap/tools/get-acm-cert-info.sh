#!/usr/local/bin/bash

DOMAIN=$1

if [ -z $1 ] ; then
  echo "Please specify domain for ACM query."
  exit 1
fi

NUM_CERTS=`aws acm list-certificates --region=us-east-1 | grep -B1 $DOMAIN | grep CertificateArn | wc -l | sed 's/[^0-9]*//g'`
echo -e "\nCertificates Found: $NUM_CERTS\n"

if [ $NUM_CERTS -eq 0 ]; then
  exit 1
else
  echo -e "ACM cert(s) returned:"
  aws acm list-certificates --region=us-east-1 | grep -B1 $DOMAIN | grep CertificateArn | awk '{print $2}' | sed 's/[",]//g'
  if [ $NUM_CERTS -eq 1 ]; then
    echo -e "\nCert details:"
    ARN=`aws acm list-certificates --region=us-east-1 | grep -B1 $DOMAIN | grep CertificateArn | awk '{print $2}' | sed 's/[",]//g'`
    aws acm describe-certificate --region=us-east-1 --certificate-arn=$ARN
  else
    echo -e "\nMultiple certs returned, please query for a single cert.\n"
    exit 1
  fi
fi
