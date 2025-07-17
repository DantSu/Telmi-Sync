#!/bin/bash

if [[ -z "$1" || -z "${PKEXEC_UID}" ]]; then
  echo "wrong-parameters" >&2
  exit 1
fi

USER_UID="${PKEXEC_UID}"
USER_GID=$( id -g "${USER_UID}" )

MOUNT_PATH="$1"
VOLUME_NAME=$(basename "$MOUNT_PATH")

DEVICE=$(df "$MOUNT_PATH" 2>/dev/null | tail -1 | awk '{print $1}')

if [ -z "$DEVICE" ] || [[ "$DEVICE" != /dev/* ]]; then
  echo "wrong-parameters" >&2
  exit 1
fi

if ! umount "$DEVICE" >/dev/null; then
  exit 1
fi

if ! mkfs.fat -F 32 -n "$VOLUME_NAME" "$DEVICE" >/dev/null 2>&1; then
  echo "formatting-failed" >&2
  exit 1
fi

if ! mkdir -p "$MOUNT_PATH" >/dev/null; then
  exit 1
fi

if ! mount "$DEVICE" "$MOUNT_PATH" -o "uid=${USER_UID},gid=${USER_GID}" >/dev/null; then
  exit 1
fi

exit 0
