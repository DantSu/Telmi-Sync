#!/bin/bash

if [ -z "$1" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

MOUNT_PATH="$1"
VOLUME_NAME=$(basename "$MOUNT_PATH")
DEVICE=$(df "$MOUNT_PATH" 2>/dev/null | tail -1 | awk '{print $1}')

if [ -z "$DEVICE" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

DISK=$(echo "$DEVICE" | sed -E 's|/dev/(disk[0-9]+)s[0-9]+|\1|')

if ! diskutil unmountDisk "/dev/$DISK" >/dev/null; then
  exit 1
fi

if ! diskutil eraseDisk FAT32 "$VOLUME_NAME" MBRFormat "/dev/$DISK" >/dev/null; then
  exit 1
fi

exit 0