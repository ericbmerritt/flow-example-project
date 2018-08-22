#!/bin/bash

function run_dev_mode () {
    # Add local user
    # Either use the LOCAL_USER_ID if passed in at runtime or
    # fallback

    echo "Starting with UID : $LOCAL_USER_ID"
    useradd --shell /bin/bash -u "$LOCAL_USER_ID" -o -c "" -m user
    export HOME=/home/user

    echo "Executing $*"
    exec /usr/local/bin/gosu user "$@"
}

function main () {
    if [[ -v "${LOCAL_USER_ID}" ]]; then
        run_dev_mode "$@"
    else
        exec "$@"
    fi

}

main "$@"
