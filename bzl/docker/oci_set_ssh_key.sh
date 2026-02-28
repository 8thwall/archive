#!/usr/bin/sh

SSH_PRIVATE_KEY=$(cat ~/.ssh/id_rsa || echo "")

if [ -n "${SSH_PRIVATE_KEY}" ]; then
    echo "SSH_PRIVATE_KEY is not set in the environment. Built image may not have access to private repositories."
fi

if [ -n "${GITLAB_NIANTIC}" ]; then
    echo "GITLAB_NIANTIC is not set in the environment. Built image may not have access to private repositories."
fi

if [ -n "${SSH_PRIVATE_KEY}" ] && [ -n "${GITLAB_NIANTIC}" ]; then
    mkdir -p ~/.ssh && umask 0077 &&
    echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa &&
    ssh-keyscan "${GITLAB_NIANTIC}" | head -n 1 >> ~/.ssh/known_hosts;
fi