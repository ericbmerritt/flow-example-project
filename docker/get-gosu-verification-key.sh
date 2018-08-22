#! /bin/bash

set -e
function main() {
    local download_key="$1"
    for server in ha.pool.sks-keyservers.net \
              hkp://p80.pool.sks-keyservers.net:80 \
              keyserver.ubuntu.com \
              hkp://keyserver.ubuntu.com:80 \
              pgp.mit.edu; do
        gpg --keyserver "$server" --recv-keys "$download_key" && break || echo "Trying new server..."
    done
}
main "$1"
