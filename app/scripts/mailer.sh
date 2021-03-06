#!/bin/bash

cd /path/to/app

# read env vars from ecosystem file
while read -r line; do
    VAL=$(echo "$line" | sed -r 's/^([A-Za-z0-9_]+) *: *(.+)/\1=\2/')
    eval "$VAL"
done < <(./yq e '.apps[0].env' ecosystem.yml)

query="${ATAD_FQDN}:${PORT}/mail"
curl ${query}
