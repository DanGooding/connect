#!/bin/bash

aws ssm get-parameter \
  --region=eu-west-2 \
  --name cloudflare-signed-origin-certificate \
  > /etc/pki/tls/certs/origin-server.crt

aws ssm get-parameter \
  --region=eu-west-2 \
  --name cloudflare-signed-origin-private-key \
  --with-decryption \
  > /etc/pki/tls/certs/origin-server.key

echo whoami
