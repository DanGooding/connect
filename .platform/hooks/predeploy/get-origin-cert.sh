#!/bin/bash

certificate=/etc/pki/tls/certs/origin-server.crt
private_key=/etc/pki/tls/certs/origin-server.key

aws ssm get-parameter \
  --region=eu-west-2 \
  --name cloudflare-signed-origin-certificate \
  --query Parameter.Value \
  --output text \
  > $certificate

aws ssm get-parameter \
  --region=eu-west-2 \
  --name cloudflare-signed-origin-private-key \
  --with-decryption \
  --query Parameter.Value \
  --output text \
  > $private_key

chmod 0444 $certificate
chmod 0440 $private_key
chown nginx $certificate $private_key

cat $certificate
