#!/bin/bash

if [ -z "$1" ]; then
    exit 1
fi

readonly mountPoint="$1"

if ! mountpoint -q "$mountPoint"; then
    exit 1
fi

readonly partition=$(lsblk -nr -o NAME,MOUNTPOINT | awk -v mp="$mountPoint" '$2 == mp {print "/dev/"$1}')

if [ -z "$partition" ]; then
    exit 1
fi

readonly deviceName=$(lsblk -no PKNAME "$partition")

sync

udisksctl unmount -b "$partition" >/dev/null

readonly drivePath=$(gdbus call --system \
  --dest org.freedesktop.UDisks2 \
  --object-path "/org/freedesktop/UDisks2/block_devices/$deviceName" \
  --method org.freedesktop.DBus.Properties.Get \
  org.freedesktop.UDisks2.Block Drive \
  | cut -d "'" -f2)


if [ -z "$drivePath" ]; then
    exit 1
fi

gdbus call --system \
  --dest org.freedesktop.UDisks2 \
  --object-path "$drivePath" \
  --method org.freedesktop.UDisks2.Drive.Eject \
  "@"a{sv}" {}" >/dev/null

exit 0
