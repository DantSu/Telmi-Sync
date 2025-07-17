#!/usr/bin/env bash

readonly pathDevice=$1

sync $pathDevice

if ! umount -l "$pathDevice" >/dev/null; then
  exit 1
fi

exit 0
