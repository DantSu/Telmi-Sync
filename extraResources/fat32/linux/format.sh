#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

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

if ! mkfs.fat -F 32 -n "$VOLUME_NAME" "$DEVICE" >/dev/null; then
  exit 1
fi

exit 0