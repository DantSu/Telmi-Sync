#!/bin/bash

if [[ -z "$1" || -z "${PKEXEC_UID}" ]]; then
  echo "wrong-parameters" >&2
  exit 1
fi

readonly userUID="$PKEXEC_UID"
readonly userGID=$( id -g "$userUID" )

readonly mountPath="$1"
readonly volumeName=$(basename "$mountPath")
readonly device=$(df "$mountPath" 2>/dev/null | tail -1 | awk '{print $1}')

if [[ -z "$device" || "$device" != /dev/* ]]; then
  echo "wrong-parameters" >&2
  exit 1
fi

if ! umount "$device" >/dev/null; then
  exit 1
fi

if ! mkfs.fat -F 32 -n "$volumeName" "$device" >/dev/null 2>&1; then
  echo "formatting-failed" >&2
  exit 1
fi

if ! mkdir -p "$mountPath" >/dev/null; then
  exit 1
fi

if ! mount "$device" "$mountPath" -o "uid=$userUID,gid=$userGID" >/dev/null; then
  exit 1
fi

exit 0
