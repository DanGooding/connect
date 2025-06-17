#!/bin/bash

certificate=/etc/pki/tls/certs/origin-server.crt
private_key=/etc/pki/tls/certs/origin-server.key

aws ssm get-parameter \
  --region=eu-west-2 \
  --name cloudflare-signed-origin-certificate \
  > $certificate

aws ssm get-parameter \
  --region=eu-west-2 \
  --name cloudflare-signed-origin-private-key \
  --with-decryption \
  > $private_key

chmod 0444 $certificate
chmod 0440 $private_key
chown nginx $certificate $private_key

cat $certificate
