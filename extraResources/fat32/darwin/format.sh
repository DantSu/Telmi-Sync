#!/bin/bash

if [ -z "$1" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

VOLUME_NAME="$1"

DEVICE=$(df "/Volumes/$VOLUME_NAME" 2>/dev/null | tail -1 | awk '{print $1}')

if [ -z "$DEVICE" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

DISK=$(echo "$PART_DEVICE" | sed -E 's|/dev/(disk[0-9]+)s[0-9]+|\1|')

if ! diskutil unmountDisk "/dev/$DISK" >/dev/null 2>&1; then
  echo "formatting-failed" >&2
  exit 1
fi

if ! diskutil eraseDisk FAT32 "Telmi OS" MBRFormat "/dev/$DISK" >/dev/null; then
  echo "formatting-failed" >&2
  exit 1
fi

exit 0