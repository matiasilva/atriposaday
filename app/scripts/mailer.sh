#!/bin/bash
query="${ATAD_FQDN}:${PORT}/mailer"
curl ${query} >/dev/null 2>&1