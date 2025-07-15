#!/bin/bash

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

if ! umount "$DEVICE" >/dev/null 2>&1; then
  echo "formatting-failed" >&2
  exit 1
fi

if ! mkfs.vfat -F 32 -n "$VOLUME_NAME" "$DEVICE" >/dev/null 2>&1; then
  echo "formatting-failed" >&2
  exit 1
fi

exit 0