#!/bin/bash

if [ -z "$1" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

readonly mountPath="$1"
readonly volumeName=$(basename "$mountPath")
readonly device=$(df "$mountPath" 2>/dev/null | tail -1 | awk '{print $1}')

if [ -z "$device" ]; then
  echo "wrong-parameters" >&2
  exit 1
fi

readonly disk=$(echo "$device" | sed -E 's|/dev/(disk[0-9]+)s[0-9]+|\1|')

if ! diskutil unmountDisk "/dev/$disk" >/dev/null; then
  exit 1
fi

if ! diskutil eraseDisk FAT32 "$volumeName" MBRFormat "/dev/$disk" >/dev/null; then
  exit 1
fi

exit 0