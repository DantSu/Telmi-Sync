#!/bin/sh
readonly mountPart=$(df "$1" | tail -1 | awk '{ print $1 }')

if ! diskutil unmount "$mountPart" >/dev/null; then
  exit 1
fi

exit 0
