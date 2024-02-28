#!/usr/bin/env bash
mountPart=$(df "$1" | tail -1 | awk '{ print $1 }')
umount -l "$1"
udisksctl power-off -b "$mountPart" --no-user-interaction
